import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { listUsers, getAllAttendances, listShifts, listExpenses } from "../../lib/db";
import * as XLSX from "xlsx";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  const type = req.query.type || "attendances";
  let rows = [];
  let filename = "export.xlsx";
  if (type === "users") {
    rows = await listUsers();
    filename = "users.xlsx";
  } else if (type === "attendances") {
    rows = await getAllAttendances();
    filename = "attendances.xlsx";
  } else if (type === "shifts") {
    rows = await listShifts();
    filename = "shifts.xlsx";
  } else if (type === "expenses") {
    rows = await listExpenses();
    filename = "expenses.xlsx";
  } else {
    return res.status(400).json({ ok: false, message: "unknown type" });
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buf);
}


