import { parseUserFromRequest } from '../../lib/auth';
import { db } from '../../lib/db'; // your drizzle connection
import { users, subscriptions } from '../../lib/db/schema'; // adjust names
import { eq } from 'drizzle-orm';

export async function getServerSideProps({ req }) {
  const user = parseUserFromRequest(req);

  if (!user || user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Example join – adapt to your actual schema:
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      planKey: subscriptions.planKey,
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
    })
    .from(users)
    .leftJoin(subscriptions, eq(users.id, subscriptions.userId));

  return {
    props: {
      members: rows.map((r) => ({
        id: r.id,
        email: r.email,
        role: r.role,
        planKey: r.planKey || 'free',
        status: r.status || 'inactive',
        currentPeriodEnd: r.currentPeriodEnd || null,
      })),
    },
  };
}

export default function AdminMembers({ members }) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Membership Console</h1>
      <p>View user accounts, roles, and subscription status.</p>

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              ID
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              Email
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              Role
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              Plan
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              Status
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
              Current Period End
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                {m.id}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                {m.email}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                {m.role}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                {m.planKey}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                {m.status}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                {m.currentPeriodEnd || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
