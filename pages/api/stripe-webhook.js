import Stripe from 'stripe';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parser for Stripe webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data));
    });
    req.on('error', reject);
  });
}

// Helper to get database connection
async function getDb() {
  return open({
    filename: './recipes.db',
    driver: sqlite3.Database,
  });
}

// Helper to update user subscription
async function updateUserSubscription(db, userId, subscriptionData) {
  await db.run(
    `UPDATE users SET 
      subscription_tier = ?, 
      stripe_subscription_id = ?, 
      subscription_status = ?, 
      subscription_start_date = ?,
      subscription_end_date = ?
    WHERE id = ?`,
    [
      subscriptionData.tier,
      subscriptionData.subscriptionId,
      subscriptionData.status,
      subscriptionData.startDate,
      subscriptionData.endDate,
      userId,
    ]
  );
}

// Helper to find user by Stripe customer ID
async function findUserByStripeCustomer(db, customerId) {
  return db.get(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customerId]
  );
}

// Main webhook handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // Verify Stripe signature
    const body = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        try {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Get plan key from metadata
          const planKey = session.metadata?.planKey || 'free';
          
          // Find user by Stripe customer ID
          let user = await findUserByStripeCustomer(db, session.customer);
          
          if (!user) {
            // Fallback: create or find by email
            user = await db.get(
              'SELECT id FROM users WHERE email = ?',
              [session.customer_email]
            );
          }

          if (user) {
            // Update user with subscription info
            await updateUserSubscription(db, user.id, {
              tier: planKey,
              subscriptionId: session.subscription,
              status: 'active',
              startDate: now,
              endDate: null,
            });
            console.log(`User ${user.id} activated on plan ${planKey}`);
          } else {
            console.warn(`No user found for email: ${session.customer_email}`);
          }
        } catch (err) {
          console.error('Error processing checkout session:', err);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);

        try {
          // Find user by stripe_subscription_id
          const user = await db.get(
            'SELECT id FROM users WHERE stripe_subscription_id = ?',
            [subscription.id]
          );

          if (user) {
            // Map Stripe status to app status
            let appStatus = 'active';
            if (subscription.status === 'past_due') appStatus = 'past_due';
            if (subscription.status === 'canceled') appStatus = 'canceled';
            if (subscription.status === 'unpaid') appStatus = 'past_due';

            await updateUserSubscription(db, user.id, {
              tier: user.subscription_tier, // Keep existing tier
              subscriptionId: subscription.id,
              status: appStatus,
              startDate: user.subscription_start_date,
              endDate: appStatus === 'canceled' ? now : null,
            });
            console.log(`User ${user.id} subscription updated to ${appStatus}`);
          }
        } catch (err) {
          console.error('Error processing subscription update:', err);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription deleted:', subscription.id);

        try {
          const user = await db.get(
            'SELECT id FROM users WHERE stripe_subscription_id = ?',
            [subscription.id]
          );

          if (user) {
            await updateUserSubscription(db, user.id, {
              tier: 'free',
              subscriptionId: null,
              status: 'canceled',
              startDate: user.subscription_start_date,
              endDate: now,
            });
            console.log(`User ${user.id} subscription cancelled`);
          }
        } catch (err) {
          console.error('Error processing subscription deletion:', err);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Invoice payment failed:', invoice.id);

        try {
          const user = await db.get(
            'SELECT id FROM users WHERE stripe_customer_id = ?',
            [invoice.customer]
          );

          if (user) {
            await db.run(
              'UPDATE users SET subscription_status = ? WHERE id = ?',
              ['past_due', user.id]
            );
            console.log(`User ${user.id} marked as past_due`);
          }
        } catch (err) {
          console.error('Error processing payment failure:', err);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  } finally {
    await db.close();
  }
}
