import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) return res.json({ ok: false });
  return res.json({ ok: true, user });
}


