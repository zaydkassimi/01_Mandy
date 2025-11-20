import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { listUsers, listShifts, getAllAttendances, listExpenses } from "../../lib/db";

export default function Admin({ user, stats }) {
  if (!user || user.role !== "admin") {
    return <main><h1>403 - forbidden</h1></main>;
  }
  return (
    <main>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="small">Overview of staff, shifts, attendance and expenses.</p>
      </div>

      <section className="stats-grid" aria-label="Key metrics">
        <div className="card stat-card">
          <div className="stat-top">
            <div className="small">Total staff</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div>
            <a href="/admin/staff" className="btn">Manage Staff</a>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-top">
            <div className="small">Total shifts</div>
            <div className="stat-value">{stats.totalShifts}</div>
          </div>
          <div>
            <a href="/admin/shifts" className="btn">Manage Shifts</a>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-top">
            <div className="small">Attendance records</div>
            <div className="stat-value">{stats.totalAttendances}</div>
          </div>
          <div>
            <a href="/admin/attendance" className="btn secondary">View Attendance</a>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-top">
            <div className="small">Total expenses</div>
            <div className="stat-value">£{Number(stats.expenseTotal).toFixed(2)}</div>
          </div>
          <div>
            <a href="/admin/expenses" className="btn">Expenses</a>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="card welcome-card">
          <h3 style={{ margin: 0 }}>Welcome, <strong>{user.email}</strong></h3>
          <p className="small" style={{ marginTop: 10 }}>Use the tiles above to manage staff, shifts, attendance and expenses. Visit the Export page to download data.</p>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }

  const users = await listUsers();
  const shifts = await listShifts();
  const attends = await getAllAttendances();
  const expenses = await listExpenses();

  const stats = {
    totalUsers: (users || []).length,
    totalShifts: (shifts || []).length,
    totalAttendances: (attends || []).length,
    expenseTotal: (expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0)
  };

  return { props: { user, stats } };
}


