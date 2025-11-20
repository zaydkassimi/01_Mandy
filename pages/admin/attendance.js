import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { useEffect, useState } from "react";

export default function AdminAttendance({ user }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/attendance?all=1")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setList(data.attendances || []);
      });
  }, []);

  async function approve(id, approve) {
    await fetch("/api/attendance/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: approve })
    });
    setList((s) => s.map((it) => (it.id === id ? { ...it, approved: approve } : it)));
  }

  return (
    <main>
      <h1>All Attendance</h1>
      <div className="card">
        <p>Signed in as <strong>{user.email}</strong></p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Action</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Time</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Geo</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Photo</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Approved</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>{r.email}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>{r.action}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>{new Date(r.timestamp).toLocaleString()}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>{r.lat ? `${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}` : "-"}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
                  {r.photo ? <img src={r.photo} style={{ width: 80, borderRadius: 6 }} /> : "-"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
                  {r.approved ? "Yes" : "No"} {r.lateRequested ? "(Late requested)" : ""}
                  <div style={{ marginTop: 6 }}>
                    {!r.approved && <button className="btn" onClick={() => approve(r.id, true)}>Approve</button>}
                    {r.approved && <button className="btn secondary" onClick={() => approve(r.id, false)}>Revoke</button>}
                  </div>
                </td>
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


