import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { listExpenses, addExpense } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  if (req.method === "GET") {
    const expenses = await listExpenses();
    return res.json({ ok: true, expenses });
  }

  if (req.method === "POST") {
    const { date, amount, note } = req.body || {};
    if (!date || amount == null) return res.status(400).json({ ok: false, message: "date & amount required" });
    const id = String(Date.now()) + "-" + Math.floor(Math.random() * 1000);
    const exp = { id, date, amount: Number(amount), note: note || "" };
    await addExpense(exp);
    return res.json({ ok: true, expense: exp });
  }

  return res.status(405).end();
}


