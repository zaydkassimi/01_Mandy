import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { listShifts, addShift, deleteShiftById } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  if (req.method === "GET") {
    const shifts = await listShifts();
    return res.json({ ok: true, shifts });
  }

  if (req.method === "POST") {
    const { title, date, start, end, capacity } = req.body || {};
    if (!title || !date) return res.status(400).json({ ok: false, message: "title & date required" });
    const id = String(Date.now()) + "-" + Math.floor(Math.random() * 1000);
    const shift = { id, title, date, start: start || null, end: end || null, capacity: capacity || 1 };
    await addShift(shift);
    return res.json({ ok: true, shift });
  }

  if (req.method === "DELETE") {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ ok: false, message: "id required" });
    await deleteShiftById(id);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}


