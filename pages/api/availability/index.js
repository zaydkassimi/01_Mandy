import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { getAvailabilitiesByEmail, setAvailability } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) return res.status(401).json({ ok: false, message: "Not authenticated" });

  if (req.method === "GET") {
    const list = await getAvailabilitiesByEmail(user.email);
    return res.json({ ok: true, availabilities: list });
  }

  if (req.method === "POST") {
    const { date, status } = req.body || {};
    if (!date) return res.status(400).json({ ok: false, message: "date required" });
    // status: "available" | "unavailable" | null
    await setAvailability(user.email, date, status || null);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}


