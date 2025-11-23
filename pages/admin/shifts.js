import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { useEffect, useState } from "react";
import { ToastContext } from "../../components/ToastContext";
import { useContext } from "react";

export default function AdminShifts({ user }) {
  const [shifts, setShifts] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [availabilities, setAvailabilities] = useState([]);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetch("/api/admin/shifts").then((r) => r.json()).then((d) => { if (d.ok) setShifts(d.shifts || []); });
    fetch("/api/admin/availability").then((r) => r.json()).then((d) => { if (d.ok) setAvailabilities(d.availabilities || []); });
  }, []);

  async function add() {
    await fetch("/api/admin/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, start, end, capacity })
    });
    setTitle(""); setDate(""); setStart(""); setEnd(""); setCapacity(1);
    const res = await fetch("/api/admin/shifts"); const j = await res.json();
    if (j.ok) setShifts(j.shifts || []);
  }

  async function del(id) {
    if (!confirm("Delete shift?")) return;
    await fetch("/api/admin/shifts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setShifts((s) => s.filter((sh) => sh.id !== id));
  }

  async function assignToShift(shiftId, email) {
    if (!email) return alert("Choose a staff email");
    const res = await fetch("/api/admin/assign_shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId, email })
    });
    const data = await res.json();
    if (data.ok) {
      showToast("Assigned");
      // refresh shifts
      const res2 = await fetch("/api/admin/shifts"); const j = await res2.json();
      if (j.ok) setShifts(j.shifts || []);
    } else {
      showToast("Assign failed", { type: "error" });
    }
  }

  return (
    <main>
      <h1>Manage Shifts</h1>
      <div className="card">
        <div>
          <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} /> <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} style={{ marginLeft: 8 }} /> <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} style={{ marginLeft: 8 }} />
          <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
          <button className="btn" onClick={add} style={{ marginLeft: 8 }}>Add Shift</button>
        </div>
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Cap</th><th>Action</th></tr></thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id}>
                <td style={{ padding: 8 }}>{s.title}</td>
                <td style={{ padding: 8 }}>{s.date}</td>
                <td style={{ padding: 8 }}>{s.start} - {s.end}</td>
                <td style={{ padding: 8 }}>{s.capacity}</td>
                <td style={{ padding: 8 }}>
                  <button className="btn secondary" onClick={() => del(s.id)}>Delete</button>
                  <div style={{ marginTop: 8 }}>
                    <select id={"assign-"+s.id} defaultValue="">
                      <option value="">Assign staff</option>
                      {availabilities.filter(a => a.date === s.date).map(a => <option key={a.email} value={a.email}>{a.email}</option>)}
                    </select>
                    <button className="btn" style={{ marginLeft: 8 }} onClick={() => {
                      const sel = document.getElementById("assign-"+s.id);
                      assignToShift(s.id, sel?.value);
                    }}>Assign</button>
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


