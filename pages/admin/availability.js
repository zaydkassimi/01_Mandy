import { parse } from "cookie";
import { verifyToken } from "../../lib/auth";
import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useContext } from "react";
import { ToastContext } from "../../components/ToastContext";

export default function AdminAvailability({ user }) {
  const [avail, setAvail] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [monthStart, setMonthStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const a = await fetch("/api/admin/availability").then((r) => r.json());
    const s = await fetch("/api/admin/shifts").then((r) => r.json());
    if (a.ok) setAvail(a.availabilities || []);
    if (s.ok) setShifts(s.shifts || []);
  }

  const { showToast } = useContext(ToastContext);

  async function assign(availability, shiftId) {
    if (!shiftId) return alert("Choose a shift");
    setLoading(true);
    const res = await fetch("/api/admin/assign_shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId, email: availability.email })
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      showToast(`Assigned ${availability.email} to shift`, { type: "info" });
      fetchData();
    } else {
      showToast("Assignment failed", { type: "error" });
    }
  }

  // group by date
  const byDate = avail.reduce((acc, a) => {
    acc[a.date] = acc[a.date] || [];
    acc[a.date].push(a);
    return acc;
  }, {});

  function formatDateKey(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function daysInMonth(d) {
    const year = d.getFullYear();
    const month = d.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }

  function prevMonth() {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() - 1);
    setMonthStart(d);
    setSelectedDate(null);
  }
  function nextMonth() {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() + 1);
    setMonthStart(d);
    setSelectedDate(null);
  }

  return (
    <main>
      <h1>Staff Availability</h1>
      <p className="small">View staff availability and allocate shifts.</p>
      {message && <div className="mt-3 p-3 rounded-md bg-green-50 text-green-800">{message}</div>}

      <div className="mt-4">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={prevMonth} variant="ghost">Prev</Button>
          <div className="font-semibold">{monthStart.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
          <Button onClick={nextMonth} variant="ghost">Next</Button>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-sm text-gray-500">{d}</div>)}
          {Array.from({ length: new Date(monthStart.getFullYear(), monthStart.getMonth(), 1).getDay() }).map((_, i) => <div key={"b"+i} />)}
          {Array.from({ length: daysInMonth(monthStart) }).map((_, idx) => {
            const day = idx + 1;
            const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
            const key = formatDateKey(d);
            const items = byDate[key] || [];
            const dayShifts = shifts.filter(s => s.date === key);
            return (
              <div key={key} className="p-3 border rounded-md bg-white">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">{day}</div>
                  <div className="text-xs text-gray-500">{items.length} avail</div>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  {items.slice(0,3).map(it => <div key={it.email} className="flex items-center justify-between"><div>{it.email}</div></div>)}
                  {items.length > 3 && <div className="text-xs text-gray-400">+{items.length-3} more</div>}
                </div>
                <div className="mt-3">
                  <Button onClick={() => setSelectedDate(key)} variant="secondary">Manage</Button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <Card className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-semibold">{selectedDate}</div>
              </div>
              <div>
                <Button onClick={() => { setSelectedDate(null); }}>Close</Button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Available staff</div>
              {(byDate[selectedDate] || []).map((it) => (
                <div key={it.email} className="flex items-center justify-between gap-3 mb-2">
                  <div>{it.email}</div>
                  <div className="flex items-center gap-2">
                    <select defaultValue="" className="border px-2 py-1 rounded-md" id={`shift-select-${it.email}`}>
                      <option value="">Select shift</option>
                      {shifts.filter(s => s.date === selectedDate).map((s) => (
                        <option key={s.id} value={s.id}>{s.title} ({s.start || "—"})</option>
                      ))}
                    </select>
                    <Button onClick={() => {
                      const sel = document.getElementById(`shift-select-${it.email}`);
                      assign(it, sel?.value);
                    }} disabled={loading}>Assign</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
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


