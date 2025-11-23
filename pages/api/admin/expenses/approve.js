import { parse } from "cookie";
import { verifyToken } from "../../../../lib/auth";
import { setExpenseApproved } from "../../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });
  if (req.method !== "POST") return res.status(405).end();
  const { id, approved } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, message: "id required" });
  const ok = await setExpenseApproved(id, !!approved);
  return res.json({ ok });
}


