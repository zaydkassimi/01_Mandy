import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { listUsers, addUser, deleteUserByEmail } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  if (req.method === "GET") {
    const users = await listUsers();
    return res.json({ ok: true, users });
  }

  if (req.method === "POST") {
    const { email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, message: "email & password required" });
    await addUser({ email, password, role: role || "employee" });
    return res.json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ ok: false, message: "email required" });
    await deleteUserByEmail(email);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}


