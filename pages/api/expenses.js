import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { addExpense } from "../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) return res.status(401).json({ ok: false, message: "Not authenticated" });

  if (req.method === "POST") {
    const { date, amount, note, receipt } = req.body || {};
    if (!date || amount == null) return res.status(400).json({ ok: false, message: "date & amount required" });
    const id = String(Date.now()) + "-" + Math.floor(Math.random() * 1000);
    const exp = { id, email: user.email, date, amount: Number(amount), note: note || "", approved: false, receipt: receipt || null };
    await addExpense(exp);
    return res.json({ ok: true, expense: exp });
  }

  return res.status(405).end();
}


