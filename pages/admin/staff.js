import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { useEffect, useState } from "react";

export default function AdminStaff({ user }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((d) => { if (d.ok) setUsers(d.users || []); });
  }, []);

  async function add() {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });
    setEmail(""); setPassword("");
    const res = await fetch("/api/admin/users"); const j = await res.json();
    if (j.ok) setUsers(j.users || []);
  }

  async function del(em) {
    if (!confirm("Delete user " + em + "?")) return;
    await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: em }) });
    setUsers((s) => s.filter((u) => u.email !== em));
  }

  return (
    <main>
      <h1>Manage Staff</h1>
      <div className="card">
        <div>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="employee">employee</option>
            <option value="admin">admin</option>
          </select>
          <button className="btn" onClick={add} style={{ marginLeft: 8 }}>Add</button>
        </div>
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead><tr><th>Email</th><th>Role</th><th>Action</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.role}</td>
                <td style={{ padding: 8 }}><button className="btn secondary" onClick={() => del(u.email)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user } };
}


