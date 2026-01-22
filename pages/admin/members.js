import { parseUserFromRequest } from '../../lib/auth';
import { db } from '../../lib/db'; // adjust if your db export path is different
import { users, subscriptions } from '../../lib/db/schema'; // adjust to your actual tables
import { eq } from 'drizzle-orm';
import AppLayout from '../../components/AppLayout';

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
    <AppLayout>
      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Membership Console</h1>
            <p>View user accounts, roles, and subscription status.</p>
          </div>
        </div>

        <section className="card">
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
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.id}
                  </td>
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.email}
                  </td>
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.role}
                  </td>
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.planKey}
                  </td>
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.status}
                  </td>
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.currentPeriodEnd || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </AppLayout>
  );
}
