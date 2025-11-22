import { useEffect, useState } from "react";
import { parse } from "cookie";
import { verifyToken } from "../lib/auth";

function formatDateKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CalendarPage({ user }) {
  const [monthStart, setMonthStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [availMap, setAvailMap] = useState({});

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          const m = {};
          for (const a of data.availabilities || []) {
            m[a.date] = a.status;
          }
          setAvailMap(m);
        }
      });
  }, []);

  function daysInMonth(d) {
    const year = d.getFullYear();
    const month = d.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }

  function prevMonth() {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() - 1);
    setMonthStart(d);
  }
  function nextMonth() {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() + 1);
    setMonthStart(d);
  }

  async function toggleDate(day) {
    const d = new Date(monthStart);
    d.setDate(day);
    const key = formatDateKey(d);
    const current = availMap[key];
    // cycle: undefined -> available -> unavailable -> undefined
    const next = current === undefined ? "available" : current === "available" ? "unavailable" : undefined;
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: key, status: next })
    });
    setAvailMap((s) => {
      const copy = { ...s };
      if (next) copy[key] = next;
      else delete copy[key];
      return copy;
    });
  }

  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const totalDays = daysInMonth(monthStart);
  const firstWeekday = new Date(year, month, 1).getDay(); // 0-6 Sun-Sat

  const blanks = Array.from({ length: firstWeekday }).map((_, i) => <div key={"b" + i} />);

  const days = Array.from({ length: totalDays }).map((_, i) => {
    const day = i + 1;
    const d = new Date(year, month, day);
    const key = formatDateKey(d);
    const status = availMap[key];
    const style = {
      padding: 8,
      borderRadius: 6,
      cursor: "pointer",
      background: status === "available" ? "#d1fae5" : status === "unavailable" ? "#fee2e2" : "white",
      border: "1px solid #e5e7eb",
      textAlign: "center"
    };
    return (
      <div key={key} style={style} onClick={() => toggleDate(day)}>
        <div style={{ fontSize: 12 }}>{day}</div>
        <div style={{ fontSize: 11, color: "#374151" }}>{status === "available" ? "Available" : status === "unavailable" ? "Unavailable" : ""}</div>
      </div>
    );
  });

  return (
    <main>
      <h1>{user?.email}'s Availability Calendar</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button className="btn secondary" onClick={prevMonth}>Prev</button>
        <div style={{ alignSelf: "center", fontWeight: 600 }}>{monthStart.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <button className="btn" onClick={nextMonth}>Next</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
        <div style={{ fontWeight: 600 }}>Sun</div><div style={{ fontWeight: 600 }}>Mon</div><div style={{ fontWeight: 600 }}>Tue</div><div style={{ fontWeight: 600 }}>Wed</div><div style={{ fontWeight: 600 }}>Thu</div><div style={{ fontWeight: 600 }}>Fri</div><div style={{ fontWeight: 600 }}>Sat</div>
        {blanks}
        {days}
      </div>
      <p style={{ marginTop: 12 }}><strong>How to use:</strong> Click a date to mark Available (green), click again to mark Unavailable (red), click again to clear.</p>
    </main>
  );
}

export function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  if (user.role === "admin") {
    return { redirect: { destination: "/admin", permanent: false } };
  }
  return { props: { user } };
}


