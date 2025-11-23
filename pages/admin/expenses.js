import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { useEffect, useState } from "react";
import { formatGBP } from "../../lib/format";
import { useContext } from "react";
import { ToastContext } from "../../components/ToastContext";

export default function AdminExpenses({ user }) {
  const [list, setList] = useState([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/admin/expenses").then((r) => r.json()).then((d) => { if (d.ok) setList(d.expenses || []); });
  }, []);

  async function add() {
    await fetch("/api/admin/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, amount, note })
    });
    setDate(""); setAmount(""); setNote("");
    const res = await fetch("/api/admin/expenses"); const j = await res.json();
    if (j.ok) setList(j.expenses || []);
  }

  async function approve(id, approve) {
    await fetch("/api/admin/expenses/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: approve })
    });
    setList((s) => s.map((e) => (e.id === id ? { ...e, approved: approve } : e)));
  }
  const [message, setMessage] = useState("");

  async function approveWithMessage(id, approve) {
    setMessage("");
    await fetch("/api/admin/expenses/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: approve })
    });
    setList((s) => s.map((e) => (e.id === id ? { ...e, approved: approve } : e)));
    const msg = approve ? "Expense approved" : "Expense approval revoked";
    setMessage(msg);
    showToast(msg, { type: approve ? "info" : "info" });
    setTimeout(() => setMessage(""), 3500);
  }
  const { showToast } = useContext(ToastContext);

  return (
    <main>
      <h1>Expenses</h1>
      <div className="card">
        <div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> <input placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input placeholder="note" value={note} onChange={(e) => setNote(e.target.value)} style={{ marginLeft: 8 }} />
          <button className="btn" onClick={add} style={{ marginLeft: 8 }}>Add</button>
        </div>
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead><tr><th>Date</th><th>Amount (GBP)</th><th>Note</th><th>By</th><th>Approved</th></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td style={{ padding: 8 }}>{e.date}</td>
                <td style={{ padding: 8 }}>{formatGBP(e.amount)}</td>
                <td style={{ padding: 8 }}>
                  {e.note}
                  {e.receipt && <div className="mt-2"><a href={e.receipt} target="_blank" rel="noreferrer" className="text-sm text-blue-600">View receipt</a></div>}
                </td>
                <td style={{ padding: 8 }}>{e.email}</td>
                <td style={{ padding: 8 }}>
                  {e.approved ? "Yes" : "No"}
                  <div style={{ marginTop: 6 }}>
                    {!e.approved && <button className="btn" onClick={() => approveWithMessage(e.id, true)}>Approve</button>}
                    {e.approved && <button className="btn secondary" onClick={() => approveWithMessage(e.id, false)}>Revoke</button>}
                  </div>
                  {e.history && (
                    <div style={{ marginTop: 8 }}>
                      <div className="small">History:</div>
                      <ul className="text-xs text-gray-600">
                        {e.history.map((h, i) => <li key={i}>{h.ts}: {h.action}</li>)}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && <div className="mt-3 p-3 rounded-md bg-green-50 text-green-800">{message}</div>}
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


