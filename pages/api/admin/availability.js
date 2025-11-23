import { parse } from "cookie";
import { verifyToken } from "../../../lib/auth";
import { getAllAvailabilities } from "../../../lib/db";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  if (req.method === "GET") {
    const list = await getAllAvailabilities();
    return res.json({ ok: true, availabilities: list });
  }

  return res.status(405).end();
}


