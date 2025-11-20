import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { listUsers, getAllAttendances, listShifts, listExpenses } from "../../lib/db";
import { Document, Packer, Paragraph, TextRun } from "docx";

async function makeDocx(rows, headers) {
  const doc = new Document();
  doc.addSection({
    children: [
      new Paragraph({ children: [new TextRun({ text: "Export", bold: true })] }),
      ...rows.map((r) => {
        const text = headers.map((h) => `${h}: ${r[h] ?? ""}`).join(" | ");
        return new Paragraph(text);
      })
    ]
  });
  const packer = new Packer();
  return await packer.toBuffer(doc);
}

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") return res.status(403).json({ ok: false, message: "admin only" });

  const type = req.query.type || "attendances";
  let rows = [];
  let headers = [];
  let filename = "export.docx";
  if (type === "users") {
    rows = await listUsers();
    headers = ["email", "role"];
    filename = "users.docx";
  } else if (type === "attendances") {
    rows = await getAllAttendances();
    headers = ["id", "email", "action", "timestamp", "lat", "lng", "approved"];
    filename = "attendances.docx";
  } else if (type === "shifts") {
    rows = await listShifts();
    headers = ["id", "title", "date", "start", "end", "capacity"];
    filename = "shifts.docx";
  } else if (type === "expenses") {
    rows = await listExpenses();
    headers = ["id", "date", "amount", "note"];
    filename = "expenses.docx";
  } else {
    return res.status(400).json({ ok: false, message: "unknown type" });
  }

  const buf = await makeDocx(rows, headers);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buf);
}


