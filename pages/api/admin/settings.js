import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { setSettings, getSettings } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  if (req.method === "GET") {
    const s = await getSettings();
    return res.json({ ok: true, settings: s });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const updated = await setSettings(body);
    return res.json({ ok: true, settings: updated });
  }

  return res.status(405).end();
}


