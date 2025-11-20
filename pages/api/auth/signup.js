import { findUserByEmail, addUser } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, message: "Email and password required" });
  const existing = await findUserByEmail(email);
  if (existing) return res.status(400).json({ ok: false, message: "User already exists" });
  const user = { email, password, role: "employee" };
  await addUser(user);
  return res.json({ ok: true });
}


