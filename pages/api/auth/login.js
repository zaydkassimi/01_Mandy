import { findUserByEmail } from "../../../lib/db";
import { signToken, setTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, message: "Email and password required" });
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) return res.status(401).json({ ok: false, message: "Invalid credentials" });
  const token = signToken({ email: user.email, role: user.role });
  setTokenCookie(res, token);
  return res.json({ ok: true });
}


