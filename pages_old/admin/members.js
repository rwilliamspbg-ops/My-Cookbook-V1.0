import { parseUserFromRequest } from '../../lib/auth';
import { db } from '../../lib/db';
import { recipes } from '../../lib/db/schema'; // <- change here
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

  const rows = await db.select().from(recipes);

  return {
    props: {
      members: rows.map((r) => ({
        id: r.id,
        title: r.title,
        createdAt: r.createdAt ?? null,
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
            <h1>Admin: Recipes</h1>
            <p>Overview of recipes stored in the system.</p>
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
                  Title
                </th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                  Created At
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
                    {m.title}
                  </td>
                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                      padding: '0.5rem',
                    }}
                  >
                    {m.createdAt || '-'}
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
