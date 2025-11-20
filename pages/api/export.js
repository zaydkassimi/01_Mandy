import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { listUsers, getAllAttendances, listShifts, listExpenses } from "../../lib/db";

function toCSV(rows, headers) {
  const esc = (v) => {
    if (v == null) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const head = headers.map((h) => esc(h)).join(",");
  const lines = rows.map((r) => headers.map((h) => esc(r[h])).join(","));
  return [head, ...lines].join("\n");
}

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  const type = req.query.type || "attendances";
  if (type === "users") {
    const users = await listUsers();
    const csv = toCSV(users, ["email", "role"]);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');
    res.send(csv);
    return;
  }

  if (type === "attendances") {
    const attends = await getAllAttendances();
    const rows = attends.map((a) => ({ id: a.id, email: a.email, action: a.action, timestamp: a.timestamp, lat: a.lat, lng: a.lng, approved: a.approved }));
    const csv = toCSV(rows, ["id", "email", "action", "timestamp", "lat", "lng", "approved"]);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="attendances.csv"');
    res.send(csv);
    return;
  }

  if (type === "shifts") {
    const shifts = await listShifts();
    const csv = toCSV(shifts, ["id", "title", "date", "start", "end", "capacity"]);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="shifts.csv"');
    res.send(csv);
    return;
  }

  if (type === "expenses") {
    const exp = await listExpenses();
    const csv = toCSV(exp, ["id", "date", "amount", "note"]);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="expenses.csv"');
    res.send(csv);
    return;
  }

  return res.status(400).json({ ok: false, message: "unknown type" });
}


