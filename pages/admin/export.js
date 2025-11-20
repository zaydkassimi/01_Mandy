import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";

export default function AdminExport({ user }) {
  function download(type, fmt = "csv") {
    if (fmt === "csv") window.location.href = `/api/export?type=${type}`;
    if (fmt === "xlsx") window.location.href = `/api/export_xlsx?type=${type}`;
    if (fmt === "docx") window.location.href = `/api/export_docx?type=${type}`;
  }

  const tiles = [
    { key: "users", title: "Users", desc: "All staff accounts and roles", emoji: "👥" },
    { key: "attendances", title: "Attendance", desc: "Check-in/out records with location & photo", emoji: "🕘" },
    { key: "shifts", title: "Shifts", desc: "Scheduled shifts and times", emoji: "📅" },
    { key: "expenses", title: "Expenses", desc: "Recorded expenses (GBP)", emoji: "💷" }
  ];

  return (
    <main>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h1>Export Data</h1>
        <div className="small">Signed in as <strong>{user.email}</strong></div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <p className="small">Select the dataset and format you want to export. CSV is good for spreadsheets, XLSX for richer Excel use, DOCX for readable reports.</p>

        <div className="export-grid" style={{ marginTop: 18 }}>
          {tiles.map((t) => (
            <div className="export-tile card" key={t.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.title}</div>
                  <div className="small">{t.desc}</div>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => download(t.key, "csv")}>CSV</button>
                <button className="btn secondary" onClick={() => download(t.key, "xlsx")}>XLSX</button>
                <button className="btn" onClick={() => download(t.key, "docx")}>DOCX</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user } };
}


