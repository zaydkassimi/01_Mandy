import { getSettings } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const settings = await getSettings();
  res.json({ ok: true, settings });
}


