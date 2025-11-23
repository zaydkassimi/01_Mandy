import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { listShifts, getAllAttendances, listUsers } from "../../lib/db";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useCallback } from "react";

export default function AdminReports({ user, shifts, attendances, users }) {
  // build staff summary
  const staffSummary = (users || []).map((u) => {
    const assignedCount = (shifts || []).filter((s) => (s.assigned || []).includes(u.email)).length;
    const attendCount = (attendances || []).filter((a) => a.email === u.email).length;
    return { email: u.email, assignedCount, attendCount };
  });

  return (
    <main>
      <h1>Reports</h1>
      <p className="small">Overview of assigned shifts and attendance per staff.</p>

      <div className="flex gap-3 mt-4">
        <a className="nav-link" href="/api/export?type=shifts">Download shifts (CSV)</a>
        <a className="nav-link" href="/api/export_xlsx?type=shifts">Download shifts (XLSX)</a>
        <Button onClick={async () => {
          // create staff summary CSV client-side
          const rows = users.map(u => {
            const assignedCount = (shifts || []).filter((s) => (s.assigned || []).includes(u.email)).length;
            const attendCount = (attendances || []).filter((a) => a.email === u.email).length;
            return { email: u.email, assignedCount, attendCount };
          });
          const header = ["email","assignedCount","attendCount"];
          const csv = [header.join(","), ...rows.map(r => `${r.email},${r.assignedCount},${r.attendCount}`)].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "staff-summary.csv";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }}>Download staff summary (CSV)</Button>
        <Button onClick={async () => {
          // XLSX via client SheetJS
          const XLSX = await import("xlsx");
          const rows = users.map(u => {
            const assignedCount = (shifts || []).filter((s) => (s.assigned || []).includes(u.email)).length;
            const attendCount = (attendances || []).filter((a) => a.email === u.email).length;
            return { email: u.email, assignedCount, attendCount };
          });
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "staff");
          const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const blob = new Blob([wbout], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "staff-summary.xlsx";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }} variant="secondary">Download staff summary (XLSX)</Button>
      </div>

      <div className="grid gap-4 mt-4">
        <Card>
          <h3 className="font-semibold">Shifts (with assigned staff)</h3>
          <table style={{ width: "100%", marginTop: 12 }}>
            <thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Assigned</th></tr></thead>
            <tbody>
              {(shifts || []).map((s) => (
                <tr key={s.id}>
                  <td style={{ padding: 8 }}>{s.title}</td>
                  <td style={{ padding: 8 }}>{s.date}</td>
                  <td style={{ padding: 8 }}>{s.start || "-"} - {s.end || "-"}</td>
                  <td style={{ padding: 8 }}>{(s.assigned || []).join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="font-semibold">Staff summary</h3>
          <table style={{ width: "100%", marginTop: 12 }}>
            <thead><tr><th>Staff</th><th>Assigned shifts</th><th>Attendance records</th></tr></thead>
            <tbody>
              {staffSummary.map((s) => (
                <tr key={s.email}>
                  <td style={{ padding: 8 }}>{s.email}</td>
                  <td style={{ padding: 8 }}>{s.assignedCount}</td>
                  <td style={{ padding: 8 }}>{s.attendCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  const shifts = await listShifts();
  const attends = await getAllAttendances();
  const users = await listUsers();
  return { props: { user, shifts, attendances: attends, users } };
}


