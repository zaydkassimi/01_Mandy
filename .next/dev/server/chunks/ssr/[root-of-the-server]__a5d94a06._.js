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
"[project]/pages/calendar.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarPage,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/cookie [external] (cookie, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [ssr] (ecmascript)");
;
;
;
;
function formatDateKey(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
function CalendarPage({ user }) {
    const [monthStart, setMonthStart] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        const d = new Date();
        d.setDate(1);
        return d;
    });
    const [availMap, setAvailMap] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetch("/api/availability").then((r)=>r.json()).then((data)=>{
            if (data.ok) {
                const m = {};
                for (const a of data.availabilities || []){
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: key,
                status: next
            })
        });
        setAvailMap((s)=>{
            const copy = {
                ...s
            };
            if (next) copy[key] = next;
            else delete copy[key];
            return copy;
        });
    }
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const totalDays = daysInMonth(monthStart);
    const firstWeekday = new Date(year, month, 1).getDay(); // 0-6 Sun-Sat
    const blanks = Array.from({
        length: firstWeekday
    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, "b" + i, false, {
            fileName: "[project]/pages/calendar.js",
            lineNumber: 76,
            columnNumber: 69
        }, this));
    const days = Array.from({
        length: totalDays
    }).map((_, i)=>{
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: style,
            onClick: ()=>toggleDate(day),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 12
                    },
                    children: day
                }, void 0, false, {
                    fileName: "[project]/pages/calendar.js",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 11,
                        color: "#374151"
                    },
                    children: status === "available" ? "Available" : status === "unavailable" ? "Unavailable" : ""
                }, void 0, false, {
                    fileName: "[project]/pages/calendar.js",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            ]
        }, key, true, {
            fileName: "[project]/pages/calendar.js",
            lineNumber: 92,
            columnNumber: 7
        }, this);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: [
                    user?.email,
                    "'s Availability Calendar"
                ]
            }, void 0, true, {
                fileName: "[project]/pages/calendar.js",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    marginBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "btn secondary",
                        onClick: prevMonth,
                        children: "Prev"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            alignSelf: "center",
                            fontWeight: 600
                        },
                        children: monthStart.toLocaleString(undefined, {
                            month: "long",
                            year: "numeric"
                        })
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "btn",
                        onClick: nextMonth,
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/calendar.js",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(7,1fr)",
                    gap: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Sun"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Mon"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 51
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Tue"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 93
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Wed"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 135
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Thu"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 177
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Fri"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 219
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 600
                        },
                        children: "Sat"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 108,
                        columnNumber: 261
                    }, this),
                    blanks,
                    days
                ]
            }, void 0, true, {
                fileName: "[project]/pages/calendar.js",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                style: {
                    marginTop: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                        children: "How to use:"
                    }, void 0, false, {
                        fileName: "[project]/pages/calendar.js",
                        lineNumber: 112,
                        columnNumber: 36
                    }, this),
                    " Click a date to mark Available (green), click again to mark Unavailable (red), click again to clear."
                ]
            }, void 0, true, {
                fileName: "[project]/pages/calendar.js",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/calendar.js",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
function getServerSideProps({ req }) {
    const cookies = req.headers.cookie ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$cookie__$5b$external$5d$__$28$cookie$2c$__cjs$29$__["parse"])(req.headers.cookie || "") : {};
    const token = cookies.token;
    const user = token ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["verifyToken"])(token) : null;
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }
    return {
        props: {
            user
        }
    };
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a5d94a06._.js.map