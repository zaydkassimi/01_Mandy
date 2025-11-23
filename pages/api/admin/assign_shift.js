import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { assignUserToShift } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });
  if (req.method !== "POST") return res.status(405).end();
  const { shiftId, email } = req.body || {};
  if (!shiftId || !email) return res.status(400).json({ ok: false, message: "shiftId & email required" });
  const ok = await assignUserToShift(shiftId, email);
  return res.json({ ok });
}


