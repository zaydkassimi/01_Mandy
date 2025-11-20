import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { useEffect, useState } from "react";
import { formatGBP } from "../../lib/format";

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
          <thead><tr><th>Date</th><th>Amount (GBP)</th><th>Note</th></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td style={{ padding: 8 }}>{e.date}</td>
                <td style={{ padding: 8 }}>{formatGBP(e.amount)}</td>
                <td style={{ padding: 8 }}>{e.note}</td>
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


