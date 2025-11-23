module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/lib/db.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAttendance",
    ()=>addAttendance,
    "addExpense",
    ()=>addExpense,
    "addShift",
    ()=>addShift,
    "addUser",
    ()=>addUser,
    "assignUserToShift",
    ()=>assignUserToShift,
    "deleteShiftById",
    ()=>deleteShiftById,
    "deleteUserByEmail",
    ()=>deleteUserByEmail,
    "findUserByEmail",
    ()=>findUserByEmail,
    "getAllAttendances",
    ()=>getAllAttendances,
    "getAllAvailabilities",
    ()=>getAllAvailabilities,
    "getAttendanceByEmail",
    ()=>getAttendanceByEmail,
    "getAvailabilitiesByEmail",
    ()=>getAvailabilitiesByEmail,
    "getSettings",
    ()=>getSettings,
    "listExpenses",
    ()=>listExpenses,
    "listShifts",
    ()=>listShifts,
    "listUsers",
    ()=>listUsers,
    "readDB",
    ()=>readDB,
    "setAttendanceApproved",
    ()=>setAttendanceApproved,
    "setAvailability",
    ()=>setAvailability,
    "setExpenseApproved",
    ()=>setExpenseApproved,
    "setSettings",
    ()=>setSettings,
    "writeDB",
    ()=>writeDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DB_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "db.json");
async function readDB() {
    const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].promises.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
}
async function writeDB(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].promises.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
async function findUserByEmail(email) {
    const db = await readDB();
    return db.users.find((u)=>u.email === email);
}
async function addUser(user) {
    const db = await readDB();
    db.users.push(user);
    await writeDB(db);
    return user;
}
async function getAvailabilitiesByEmail(email) {
    const db = await readDB();
    if (!db.availabilities) db.availabilities = [];
    return db.availabilities.filter((a)=>a.email === email);
}
async function setAvailability(email, date, status) {
    const db = await readDB();
    if (!db.availabilities) db.availabilities = [];
    // remove existing for the date
    db.availabilities = db.availabilities.filter((a)=>!(a.email === email && a.date === date));
    if (status) {
        db.availabilities.push({
            email,
            date,
            status
        });
    }
    await writeDB(db);
    return true;
}
async function addAttendance(record) {
    const db = await readDB();
    if (!db.attendances) db.attendances = [];
    db.attendances.push(record);
    await writeDB(db);
    return record;
}
async function getAttendanceByEmail(email) {
    const db = await readDB();
    if (!db.attendances) db.attendances = [];
    return db.attendances.filter((a)=>a.email === email);
}
async function getAllAttendances() {
    const db = await readDB();
    if (!db.attendances) db.attendances = [];
    return db.attendances;
}
async function setAttendanceApproved(id, approved) {
    const db = await readDB();
    if (!db.attendances) db.attendances = [];
    const rec = db.attendances.find((r)=>r.id === id);
    if (!rec) return false;
    rec.approved = !!approved;
    await writeDB(db);
    return true;
}
async function listUsers() {
    const db = await readDB();
    return db.users || [];
}
async function deleteUserByEmail(email) {
    const db = await readDB();
    db.users = (db.users || []).filter((u)=>u.email !== email);
    await writeDB(db);
    return true;
}
async function listShifts() {
    const db = await readDB();
    db.shifts = db.shifts || [];
    return db.shifts;
}
async function addShift(shift) {
    const db = await readDB();
    db.shifts = db.shifts || [];
    db.shifts.push(shift);
    await writeDB(db);
    return shift;
}
async function deleteShiftById(id) {
    const db = await readDB();
    db.shifts = (db.shifts || []).filter((s)=>s.id !== id);
    await writeDB(db);
    return true;
}
async function listExpenses() {
    const db = await readDB();
    db.expenses = db.expenses || [];
    return db.expenses;
}
async function addExpense(exp) {
    const db = await readDB();
    db.expenses = db.expenses || [];
    // initialize history
    exp.history = exp.history || [
        {
            ts: new Date().toISOString(),
            action: "submitted",
            by: exp.email
        }
    ];
    db.expenses.push(exp);
    await writeDB(db);
    return exp;
}
async function getSettings() {
    const db = await readDB();
    db.settings = db.settings || {
        siteTitle: "Staff Scheduler",
        logo: null
    };
    return db.settings;
}
async function setSettings(settings) {
    const db = await readDB();
    db.settings = Object.assign(db.settings || {}, settings);
    await writeDB(db);
    return db.settings;
}
async function getAllAvailabilities() {
    const db = await readDB();
    db.availabilities = db.availabilities || [];
    return db.availabilities;
}
async function assignUserToShift(shiftId, email) {
    const db = await readDB();
    db.shifts = db.shifts || [];
    const shift = db.shifts.find((s)=>s.id === shiftId);
    if (!shift) return false;
    shift.assigned = shift.assigned || [];
    if (!shift.assigned.includes(email)) shift.assigned.push(email);
    await writeDB(db);
    return true;
}
async function setExpenseApproved(id, approved) {
    const db = await readDB();
    db.expenses = db.expenses || [];
    const rec = db.expenses.find((r)=>r.id === id);
    if (!rec) return false;
    rec.approved = !!approved;
    rec.history = rec.history || [];
    rec.history.push({
        ts: new Date().toISOString(),
        action: approved ? "approved" : "revoked"
    });
    await writeDB(db);
    return true;
}
}),
"[externals]/jsonwebtoken [external] (jsonwebtoken, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("jsonwebtoken", () => require("jsonwebtoken"));

module.exports = mod;
}),
"[externals]/cookie [external] (cookie, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("cookie", () => require("cookie"));

module.exports = mod;
}),
"[project]/lib/auth.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTokenCookie",
    ()=>clearTokenCookie,
    "setTokenCookie",
    ()=>setTokenCookie,
    "signToken",
    ()=>signToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/jsonwebtoken [external] (jsonwebtoken, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/cookie [external] (cookie, cjs)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: "8h"
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$29$__["default"].verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}
function setTokenCookie(res, token) {
    const cookie = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__["serialize"])("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 8
    });
    res.setHeader("Set-Cookie", cookie);
}
function clearTokenCookie(res) {
    const cookie = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__["serialize"])("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0
    });
    res.setHeader("Set-Cookie", cookie);
}
}),
"[project]/pages/api/auth/login.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [api] (ecmascript)");
;
;
async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({
        ok: false,
        message: "Email and password required"
    });
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["findUserByEmail"])(email);
    if (!user || user.password !== password) return res.status(401).json({
        ok: false,
        message: "Invalid credentials"
    });
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__["signToken"])({
        email: user.email,
        role: user.role
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$api$5d$__$28$ecmascript$29$__["setTokenCookie"])(res, token);
    return res.json({
        ok: true
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2d7ad242._.js.map