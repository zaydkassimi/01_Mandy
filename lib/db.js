import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function readDB() {
  const raw = await fs.promises.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function writeDB(data) {
  await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function findUserByEmail(email) {
  const db = await readDB();
  return db.users.find((u) => u.email === email);
}

export async function addUser(user) {
  const db = await readDB();
  db.users.push(user);
  await writeDB(db);
  return user;
}

export async function getAvailabilitiesByEmail(email) {
  const db = await readDB();
  if (!db.availabilities) db.availabilities = [];
  return db.availabilities.filter((a) => a.email === email);
}

export async function setAvailability(email, date, status) {
  const db = await readDB();
  if (!db.availabilities) db.availabilities = [];
  // remove existing for the date
  db.availabilities = db.availabilities.filter((a) => !(a.email === email && a.date === date));
  if (status) {
    db.availabilities.push({ email, date, status });
  }
  await writeDB(db);
  return true;
}

export async function addAttendance(record) {
  const db = await readDB();
  if (!db.attendances) db.attendances = [];
  db.attendances.push(record);
  await writeDB(db);
  return record;
}

export async function getAttendanceByEmail(email) {
  const db = await readDB();
  if (!db.attendances) db.attendances = [];
  return db.attendances.filter((a) => a.email === email);
}

export async function getAllAttendances() {
  const db = await readDB();
  if (!db.attendances) db.attendances = [];
  return db.attendances;
}

export async function setAttendanceApproved(id, approved) {
  const db = await readDB();
  if (!db.attendances) db.attendances = [];
  const rec = db.attendances.find((r) => r.id === id);
  if (!rec) return false;
  rec.approved = !!approved;
  await writeDB(db);
  return true;
}

// Admin / staff management
export async function listUsers() {
  const db = await readDB();
  return db.users || [];
}

export async function deleteUserByEmail(email) {
  const db = await readDB();
  db.users = (db.users || []).filter((u) => u.email !== email);
  await writeDB(db);
  return true;
}

// Shifts
export async function listShifts() {
  const db = await readDB();
  db.shifts = db.shifts || [];
  return db.shifts;
}

export async function addShift(shift) {
  const db = await readDB();
  db.shifts = db.shifts || [];
  db.shifts.push(shift);
  await writeDB(db);
  return shift;
}

export async function deleteShiftById(id) {
  const db = await readDB();
  db.shifts = (db.shifts || []).filter((s) => s.id !== id);
  await writeDB(db);
  return true;
}

// Expenses
export async function listExpenses() {
  const db = await readDB();
  db.expenses = db.expenses || [];
  return db.expenses;
}

export async function addExpense(exp) {
  const db = await readDB();
  db.expenses = db.expenses || [];
  // initialize history
  exp.history = exp.history || [{ ts: new Date().toISOString(), action: "submitted", by: exp.email }];
  db.expenses.push(exp);
  await writeDB(db);
  return exp;
}

export async function getSettings() {
  const db = await readDB();
  db.settings = db.settings || { siteTitle: "Staff Scheduler", logo: null };
  return db.settings;
}

export async function setSettings(settings) {
  const db = await readDB();
  db.settings = Object.assign(db.settings || {}, settings);
  await writeDB(db);
  return db.settings;
}

// Admin helpers
export async function getAllAvailabilities() {
  const db = await readDB();
  db.availabilities = db.availabilities || [];
  return db.availabilities;
}

export async function assignUserToShift(shiftId, email) {
  const db = await readDB();
  db.shifts = db.shifts || [];
  const shift = db.shifts.find((s) => s.id === shiftId);
  if (!shift) return false;
  shift.assigned = shift.assigned || [];
  if (!shift.assigned.includes(email)) shift.assigned.push(email);
  await writeDB(db);
  return true;
}

export async function setExpenseApproved(id, approved) {
  const db = await readDB();
  db.expenses = db.expenses || [];
  const rec = db.expenses.find((r) => r.id === id);
  if (!rec) return false;
  rec.approved = !!approved;
  rec.history = rec.history || [];
  rec.history.push({ ts: new Date().toISOString(), action: approved ? "approved" : "revoked" });
  await writeDB(db);
  return true;
}


