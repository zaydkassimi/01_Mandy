module.exports = [
"[externals]/cookie [external] (cookie, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("cookie", () => require("cookie"));

module.exports = mod;
}),
"[externals]/jsonwebtoken [external] (jsonwebtoken, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("jsonwebtoken", () => require("jsonwebtoken"));

module.exports = mod;
}),
"[project]/lib/auth.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/db.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/pages/admin/reports.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminReports,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/cookie [external] (cookie, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Card.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
;
;
;
;
function AdminReports({ user, shifts, attendances, users }) {
    // build staff summary
    const staffSummary = (users || []).map((u)=>{
        const assignedCount = (shifts || []).filter((s)=>(s.assigned || []).includes(u.email)).length;
        const attendCount = (attendances || []).filter((a)=>a.email === u.email).length;
        return {
            email: u.email,
            assignedCount,
            attendCount
        };
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: "Reports"
            }, void 0, false, {
                fileName: "[project]/pages/admin/reports.js",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "small",
                children: "Overview of assigned shifts and attendance per staff."
            }, void 0, false, {
                fileName: "[project]/pages/admin/reports.js",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-3 mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        className: "nav-link",
                        href: "/api/export?type=shifts",
                        children: "Download shifts (CSV)"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/reports.js",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        className: "nav-link",
                        href: "/api/export_xlsx?type=shifts",
                        children: "Download shifts (XLSX)"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/reports.js",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        onClick: async ()=>{
                            // create staff summary CSV client-side
                            const rows = users.map((u)=>{
                                const assignedCount = (shifts || []).filter((s)=>(s.assigned || []).includes(u.email)).length;
                                const attendCount = (attendances || []).filter((a)=>a.email === u.email).length;
                                return {
                                    email: u.email,
                                    assignedCount,
                                    attendCount
                                };
                            });
                            const header = [
                                "email",
                                "assignedCount",
                                "attendCount"
                            ];
                            const csv = [
                                header.join(","),
                                ...rows.map((r)=>`${r.email},${r.assignedCount},${r.attendCount}`)
                            ].join("\n");
                            const blob = new Blob([
                                csv
                            ], {
                                type: "text/csv;charset=utf-8;"
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "staff-summary.csv";
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                        },
                        children: "Download staff summary (CSV)"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/reports.js",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        onClick: async ()=>{
                            // XLSX via client SheetJS
                            const XLSX = await __turbopack_context__.A("[externals]/xlsx [external] (xlsx, cjs, async loader)");
                            const rows = users.map((u)=>{
                                const assignedCount = (shifts || []).filter((s)=>(s.assigned || []).includes(u.email)).length;
                                const attendCount = (attendances || []).filter((a)=>a.email === u.email).length;
                                return {
                                    email: u.email,
                                    assignedCount,
                                    attendCount
                                };
                            });
                            const ws = XLSX.utils.json_to_sheet(rows);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "staff");
                            const wbout = XLSX.write(wb, {
                                bookType: "xlsx",
                                type: "array"
                            });
                            const blob = new Blob([
                                wbout
                            ], {
                                type: "application/octet-stream"
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "staff-summary.xlsx";
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                        },
                        variant: "secondary",
                        children: "Download staff summary (XLSX)"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/reports.js",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/reports.js",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid gap-4 mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "font-semibold",
                                children: "Shifts (with assigned staff)"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/reports.js",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                style: {
                                    width: "100%",
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Title"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 71,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 71,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 71,
                                                    columnNumber: 51
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Assigned"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 71,
                                                    columnNumber: 64
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/reports.js",
                                            lineNumber: 71,
                                            columnNumber: 20
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/reports.js",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        children: (shifts || []).map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: s.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 75,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: s.date
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 76,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: [
                                                            s.start || "-",
                                                            " - ",
                                                            s.end || "-"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 77,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: (s.assigned || []).join(", ") || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, s.id, true, {
                                                fileName: "[project]/pages/admin/reports.js",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/reports.js",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/admin/reports.js",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/admin/reports.js",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "font-semibold",
                                children: "Staff summary"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/reports.js",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                style: {
                                    width: "100%",
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Staff"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 88,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Assigned shifts"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 88,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Attendance records"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/reports.js",
                                                    lineNumber: 88,
                                                    columnNumber: 62
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/reports.js",
                                            lineNumber: 88,
                                            columnNumber: 20
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/reports.js",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        children: staffSummary.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: s.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 92,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: s.assignedCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 93,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 8
                                                        },
                                                        children: s.attendCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/reports.js",
                                                        lineNumber: 94,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, s.email, true, {
                                                fileName: "[project]/pages/admin/reports.js",
                                                lineNumber: 91,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/reports.js",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/admin/reports.js",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/admin/reports.js",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/reports.js",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/admin/reports.js",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
async function getServerSideProps({ req }) {
    const cookies = req.headers.cookie ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__["parse"])(req.headers.cookie || "") : {};
    const token = cookies.token;
    const user = token ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["verifyToken"])(token) : null;
    if (!user || user.role !== "admin") {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }
    const shifts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["listShifts"])();
    const attends = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllAttendances"])();
    const users = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["listUsers"])();
    return {
        props: {
            user,
            shifts,
            attendances: attends,
            users
        }
    };
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5fbf5dd1._.js.map