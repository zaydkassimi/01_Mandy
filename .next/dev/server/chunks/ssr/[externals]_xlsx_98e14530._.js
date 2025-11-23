module.exports = [
"[externals]/xlsx [external] (xlsx, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_xlsx_6d5f793a._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/xlsx [external] (xlsx, cjs)");
    });
});
}),
];