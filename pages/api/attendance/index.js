import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { addAttendance, getAttendanceByEmail, getAllAttendances } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) return res.status(401).json({ ok: false, message: "Not authenticated" });

  if (req.method === "GET") {
    if (user.role === "admin" && req.query.all === "1") {
      const all = await getAllAttendances();
      return res.json({ ok: true, attendances: all });
    }
    const list = await getAttendanceByEmail(user.email);
    return res.json({ ok: true, attendances: list });
  }

  if (req.method === "POST") {
    const { action, photo, lat, lng, clientTimestamp, lateRequested } = req.body || {};
    if (!action || !photo) return res.status(400).json({ ok: false, message: "action and photo required" });
    const now = new Date();
    const rec = {
      id: String(Date.now()) + "-" + Math.floor(Math.random() * 1000),
      email: user.email,
      action,
      timestamp: now.toISOString(),
      clientTimestamp: clientTimestamp || null,
      photo,
      lat: lat || null,
      lng: lng || null,
      approved: user.role === "admin" ? true : false,
      lateRequested: !!lateRequested
    };
    await addAttendance(rec);
    return res.json({ ok: true, attendance: rec });
  }

  return res.status(405).end();
}


