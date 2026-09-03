module.exports = [
"[project]/src/components/clients/ChaosDataClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChaosDataClient",
    ()=>ChaosDataClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$ChaosDataUtility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/chaos-data/ChaosDataUtility.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$SchemaBuilderUtility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.mjs [app-ssr] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-ssr] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
'use client';
;
;
;
;
;
function ChaosDataClient() {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('presets');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col p-3 overflow-hidden gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg px-3 py-1.5 flex items-center justify-between gap-3 shrink-0 shadow-sm transition-colors font-mono",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-xs text-[var(--text-muted)]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-primary)] font-bold uppercase tracking-wider",
                                    children: "Chaos Studio:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                    lineNumber: 17,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                lineNumber: 16,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('presets'),
                                        className: `px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'presets' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                                lineNumber: 29,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Domain Presets"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                                lineNumber: 30,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                        lineNumber: 21,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('custom'),
                                        className: `px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'custom' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                                lineNumber: 41,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Custom Schema Builder"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                                lineNumber: 42,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-[9px] px-1 py-0.2 rounded font-bold ${activeTab === 'custom' ? 'bg-black/20 text-white' : 'bg-rose-500/20 text-rose-500 dark:text-rose-300'}`,
                                                children: "Visual GUI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                                lineNumber: 43,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                        lineNumber: 33,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden sm:flex items-center gap-3 text-[11px] text-[var(--text-muted)]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-3 h-3 text-rose-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "100+ BLNS Strings • Multi-Currency • Floating-Point Traps"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-h-0 overflow-hidden",
                children: activeTab === 'presets' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$ChaosDataUtility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChaosDataUtility"], {}, void 0, false, {
                    fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                    lineNumber: 63,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$SchemaBuilderUtility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SchemaBuilderUtility"], {}, void 0, false, {
                    fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/clients/ChaosDataClient.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/utilities/chaos-data/ChaosDataUtility.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChaosDataUtility",
    ()=>ChaosDataUtility
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/chaos-data/chaosDataEngine.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.mjs [app-ssr] (ecmascript) <export default as Database>");
;
;
;
;
const ChaosDataUtility = ()=>{
    const [selectedPresetId, setSelectedPresetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS_PRESETS"][0].id);
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(25);
    const [entropy, setEntropy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(65);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('table');
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [seed, setSeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if ((e.key === 'r' || e.key === 'R') && ![
                'INPUT',
                'TEXTAREA'
            ].includes(e.target.tagName)) {
                setSeed((s)=>s + 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, []);
    const selectedPreset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS_PRESETS"].find((p)=>p.id === selectedPresetId) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS_PRESETS"][0];
    }, [
        selectedPresetId
    ]);
    const generatedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        void seed;
        return selectedPreset.generate(count, entropy);
    }, [
        selectedPreset,
        count,
        entropy,
        seed
    ]);
    const currentExportFormat = viewMode === 'table' ? 'json' : viewMode;
    const exportedString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportData"])(generatedData, currentExportFormat);
    }, [
        generatedData,
        currentExportFormat
    ]);
    const payloadByteSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return new TextEncoder().encode(exportedString).length;
    }, [
        exportedString
    ]);
    const handleCopy = ()=>{
        navigator.clipboard.writeText(exportedString);
        setCopied(true);
        setTimeout(()=>setCopied(false), 1500);
    };
    const handleDownload = ()=>{
        const ext = currentExportFormat === 'typescript' ? 'ts' : currentExportFormat === 'csv' ? 'csv' : currentExportFormat === 'zod' ? 'ts' : 'json';
        const blob = new Blob([
            exportedString
        ], {
            type: 'text/plain;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `failstate-${selectedPreset.id}-${Date.now()}.${ext}`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!generatedData || generatedData.length === 0) return [];
        return Object.keys(generatedData[0]);
    }, [
        generatedData
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col gap-3 font-mono",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] uppercase mr-1 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                        className: "w-3.5 h-3.5 text-rose-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Schema:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS_PRESETS"].map((preset)=>{
                                const isSelected = preset.id === selectedPresetId;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedPresetId(preset.id),
                                    className: `px-2.5 py-1 text-xs rounded transition-colors shrink-0 ${isSelected ? 'bg-rose-500/15 text-rose-500 dark:text-rose-300 border border-rose-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-sidebar)] border border-[var(--border-dev)]'}`,
                                    children: preset.name
                                }, preset.id, false, {
                                    fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[var(--text-muted)] px-1.5 text-[10px]",
                                        children: "ROWS:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    [
                                        10,
                                        25,
                                        50,
                                        100
                                    ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCount(n),
                                            className: `px-2 py-0.5 rounded text-[11px] transition-colors ${count === n ? 'bg-black/10 dark:bg-white/10 text-cyan-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`,
                                            children: n
                                        }, n, false, {
                                            fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[var(--text-muted)] text-[10px]",
                                        children: "ENTROPY:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: "0",
                                        max: "100",
                                        value: entropy,
                                        onChange: (e)=>setEntropy(Number(e.target.value)),
                                        className: "w-20 accent-rose-500 cursor-pointer h-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `font-bold text-[11px] ${entropy > 70 ? 'text-rose-500' : 'text-cyan-500'}`,
                                        children: [
                                            entropy,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSeed((s)=>s + 1),
                                        title: "Re-roll chaos permutations (Hotkey: R)",
                                        className: "px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 flex items-center gap-1 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 134,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Re-roll (R)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 135,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCopy,
                                        className: "px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors",
                                        children: [
                                            copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-3.5 h-3.5 text-emerald-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 142,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 142,
                                                columnNumber: 85
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: copied ? 'Copied' : 'Copy'
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 143,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleDownload,
                                        title: "Download generated payload",
                                        className: "p-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                            lineNumber: 151,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-1 text-xs shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 bg-[var(--bg-panel)] p-0.5 rounded border border-[var(--border-dev)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewMode('table'),
                                className: `px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Table Grid"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            [
                                'json',
                                'typescript',
                                'zod',
                                'csv'
                            ].map((fmt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setViewMode(fmt),
                                    className: `px-2.5 py-1 rounded text-xs uppercase transition-colors ${viewMode === fmt ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`,
                                    children: fmt
                                }, fmt, false, {
                                    fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 text-[var(--text-muted)] text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "schema: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "text-[var(--text-primary)]",
                                        children: selectedPreset.id
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 183,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "columns: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "text-[var(--text-primary)]",
                                        children: columns.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 184,
                                        columnNumber: 26
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 184,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "size: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "text-cyan-500",
                                        children: [
                                            (payloadByteSize / 1024).toFixed(1),
                                            " KB"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 185,
                                        columnNumber: 23
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-h-0 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg overflow-hidden flex flex-col shadow-sm",
                children: viewMode === 'table' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "dev-table",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            style: {
                                                width: '45px'
                                            },
                                            children: "#"
                                        }, void 0, false, {
                                            fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                            lineNumber: 196,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: col
                                            }, col, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 198,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                    lineNumber: 195,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 194,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: generatedData.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "text-[var(--text-muted)] select-none font-bold",
                                                children: idx + 1
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                lineNumber: 205,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            columns.map((col)=>{
                                                const val = row[col];
                                                const isNull = val === null || val === undefined;
                                                const isNum = typeof val === 'number';
                                                const display = typeof val === 'object' ? JSON.stringify(val) : String(val);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "max-w-xs truncate",
                                                    title: display,
                                                    children: isNull ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-rose-500 font-semibold italic",
                                                        children: "null"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)) : isNum ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-emerald-600 dark:text-emerald-300",
                                                        children: display
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[var(--text-primary)]",
                                                        children: display
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, col, false, {
                                                    fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                        lineNumber: 204,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                        lineNumber: 193,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                    lineNumber: 192,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-auto p-4 font-mono text-xs text-[var(--text-code)] leading-relaxed bg-[var(--bg-codebox)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "m-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            children: exportedString
                        }, void 0, false, {
                            fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                            lineNumber: 232,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                        lineNumber: 231,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                    lineNumber: 230,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/utilities/chaos-data/ChaosDataUtility.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/utilities/chaos-data/chaosDataEngine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// FailState Chaos & Edge-Case Generation Engine
// Curated, battle-tested dirty data pools sourced from real-world production bugs.
// ═══════════════════════════════════════════════════════════════════════════════
// NAUGHTY STRINGS — Big List of Naughty Strings (BLNS) Extended Edition
// ═══════════════════════════════════════════════════════════════════════════════
__turbopack_context__.s([
    "CHAOS_PRESETS",
    ()=>CHAOS_PRESETS,
    "DIRTY_ADDRESSES",
    ()=>DIRTY_ADDRESSES,
    "DIRTY_EMAILS",
    ()=>DIRTY_EMAILS,
    "DIRTY_NAMES",
    ()=>DIRTY_NAMES,
    "DIRTY_PHONES",
    ()=>DIRTY_PHONES,
    "DIRTY_URLS",
    ()=>DIRTY_URLS,
    "NAUGHTY_STRINGS",
    ()=>NAUGHTY_STRINGS,
    "exportData",
    ()=>exportData
]);
const NAUGHTY_STRINGS = [
    // ── Zero-Width & Invisible Characters ──
    "   ",
    "\u200B\u200C\u200D\uFEFF",
    "   Leading and trailing whitespace   ",
    "Tabs\t\tand\nnewlines\r\nmixed",
    "\u00A0\u00A0Non-breaking spaces\u00A0\u00A0",
    "\u2003\u2003Em-width spaces\u2003\u2003",
    "\u200ELeft-to-right mark\u200F",
    "\uFEFFByte order mark prefix",
    "Line\u2028separator\u2029paragraph",
    "Soft\u00ADhyphen\u00ADwrapped\u00ADwords",
    // ── RTL Override & Directionality Attacks ──
    "\u202Ereversed_text_payload\u202C",
    "مرحبا بالعالم (Arabic RTL)",
    "שלום עולם (Hebrew RTL)",
    "\u202ERight to Left Override Attack\u202C normal text",
    "user\u202E\u202Dfdp.exe",
    "Price: \u202E999$\u202C",
    // ── Diacritics / Zalgo Stacking ──
    "T̷h̷e̷ ̷C̷h̷a̷o̷s̷ ̷B̷e̷g̷i̷n̷s̷",
    "Z̴a̷l̶g̸o̶ ̷t̴e̵x̵t̸ ̶s̶t̸r̴e̶s̵s̶",
    "Åge Müller-Großmann",
    "Hélène Çağdaş",
    "Ñoño año español",
    "Ÿüñíçödé ëvérÿwhéré",
    "Ǩ̵̡̛̺̩̫̹̲̤̱̤̟̞̖̫̱̜̪̖̟̠̣̙̩̥̪̺̟̩̲͕̹̮̰̝̟̳̪̠̯̺̬̹̭̦̠̘̥̪̬̲̮̹̺̦̲̥̫̟̬̲̞̥̟̤̝̥̦̩̤̮̥̤̤̥̝̤̦̟̤̤̤̥̤̦̤̤̤̥̤̤̤̦̤̤̤̥̝̤̤̤̤̤̤̤̤",
    // ── Multi-Byte & Emoji Edge Cases ──
    "👨‍👩‍👧‍👦 (ZWJ Family)",
    "🏳️‍🌈 (Emoji sequence)",
    "🂡 🂢 🂣 🂤 🂥 🂦 🂧",
    "👾".repeat(45),
    "𝓤𝓷𝓲𝓬𝓸𝓭𝓮 𝓜𝓪𝓽𝓱 𝓢𝔂𝓶𝓫𝓸𝓵𝓼",
    "🧑‍💻🧑🏻‍💻🧑🏼‍💻🧑🏽‍💻🧑🏾‍💻🧑🏿‍💻",
    "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "👩‍❤️‍💋‍👩",
    "1️⃣2️⃣3️⃣",
    "©®™℠",
    "☠️☢️☣️⚠️",
    // ── Script Mixing ──
    "Русский / 汉语 / 日本語 / English / العربية",
    "東京 / 東京都千代田区1-1",
    "Москва Moscow مسکو Moskau モスクワ",
    "München / ミュンヘン / Мюнхен / 뮌헨",
    "हिन्दी Hindi হিন্দি",
    "조선글 / 한국어 Korean",
    "ᚠᚢᚦᚨᚱᚲ Runic text",
    "𒀀𒀁𒀂 Cuneiform glyphs",
    // ── Boundary String Lengths ──
    "",
    "A",
    "AB",
    "X".repeat(255),
    "Y".repeat(256),
    "Z".repeat(1024),
    "Supercalifragilisticexpialidocious".repeat(8),
    "W".repeat(65536),
    // ── Injection Patterns (inert mock text) ──
    "<script>alert(1)</script>",
    "<img src=x onerror=alert('XSS')>",
    "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/'/+/onmouseover=1/>",
    "'; DROP TABLE users; --",
    "1' OR '1'='1",
    "1; UPDATE users SET admin=1 WHERE 1=1--",
    "' UNION SELECT * FROM information_schema.tables--",
    "{{7*7}}",
    "${7*7}",
    "#{7*7}",
    "<%= 7*7 %>",
    "{{constructor.constructor('return this')()}}",
    "${__import__('os').popen('id').read()}",
    "\"\"\"\"''''````",
    "&amp;&lt;&gt;&quot;&#39;",
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\config\\sam",
    "file:///etc/hosts",
    "data:text/html,<h1>injected</h1>",
    // ── Null, Falsy & Special Representations ──
    "null",
    "undefined",
    "NaN",
    "Infinity",
    "-Infinity",
    "[object Object]",
    "None",
    "nil",
    "NIL",
    "true",
    "false",
    "0x00",
    "-0",
    "1e+308",
    "Number.MIN_SAFE_INTEGER",
    "9007199254740993",
    "0.0",
    "-0.0",
    "0e0",
    "0/0",
    // ── Format-Breaking Characters ──
    'He said "hello" and \'goodbye\'',
    "Line1\nLine2\nLine3",
    "Column1\tColumn2\tColumn3",
    "Comma, separated, values, inside, a, field",
    'Quote"Inside"Field',
    "Back\\slash\\path\\separator",
    "Pipe|Delimited|Values",
    "Semi;colon;separated",
    "Carriage\rReturn\rOnly",
    // ── Homoglyph Confusable Attacks ──
    "раypal.com",
    "аррlе.com",
    "gооgle.com",
    "microsоft.com" // Cyrillic 'о' in 'microsoft'
];
const DIRTY_NAMES = [
    // ── Formatting Traps ──
    "Dr. O'Connor-Smith, Jr.",
    "Maria-José González-López",
    "J",
    "AB",
    "   Untrimmed User   ",
    "John   MiddleName   Doe",
    "A. B. C. D. E. F. G. Henderson",
    "Jane Doe, Ph.D, Esq.",
    "Mr./Mrs. Pat Smith-Jones (née Williams)",
    // ── Extreme Lengths ──
    "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.",
    "Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero Oliver Paul Quincy Randolph Sherman Thomas Uncas Victor William Xerxes Yancy Zeus Wolfeschlegelsteinhausenbergerdorff",
    "X",
    "Al",
    // ── Cultural Diversity ──
    "佐々木 健太",
    "田中 太郎",
    "Nguyễn Tấn Dũng",
    "Åke Lindström",
    "Hélène Çağdaş",
    "Björk Guðmundsdóttir",
    "José María Aznar López",
    "Σωκράτης (Socrates)",
    "محمد بن سلمان",
    "Владимир Путин",
    "김정은",
    "Māori Tūhoe Ngāi",
    "Ñoño Muñoz",
    "Þór Oddsson",
    "Łukasz Świerczewski",
    "Ünsal Çelik",
    "François Müller-Böhm",
    // ── Adversarial & Edge Cases ──
    "Null",
    "null",
    "undefined",
    "True",
    "None",
    "Robert'); DROP TABLE Students;--",
    "99999",
    "--------------------",
    "user@example.com",
    "<script>alert('xss')</script>",
    "Prince 👑 The First",
    "Ek Naam 🇮🇳",
    "Test\tTabbed\tName",
    "New\nLine\nName",
    "",
    " ",
    "   ",
    "ALLCAPSNAME",
    "nocapsname"
];
const DIRTY_EMAILS = [
    // ── Valid but Unusual RFC Compliant ──
    "user+tag+nested@company.subdomain.co.uk",
    "very.common@example.com",
    "disposable.style.email.with+symbol@example.com",
    "other.email-with-dash@example.com",
    "x@example.com",
    "a@b.co",
    "\"much.more unusual\"@example.com",
    "\"very.unusual.@.unusual.com\"@example.com",
    "#!$%&'*+/=?^`{}|~@example.org",
    "\" \"@example.org",
    "user.name+tag+sorting@example.com",
    // ── Internationalized Email (EAI / RFC 6531) ──
    "pelé@example.com",
    "用户@例子.广告",
    "квіток@пошта.укр",
    "χρήστης@παράδειγμα.ελ",
    "Dörte@Sörensen.example.com",
    "θσερ@εχαμπλε.ψομ",
    "dōmain@iana.org",
    // ── Edge-Case Lengths & Domains ──
    "admin@mailserver1",
    "user@localserver",
    "trailing-dot@example.com.",
    "a".repeat(64) + "@long-local-part.com",
    "user@" + "a".repeat(60) + ".example.com",
    "user@123.123.123.123",
    "user@[IPv6:2001:db8::1]",
    // ── Adversarial & Injection Patterns ──
    "null@null.void",
    "test@test",
    "@missing-local.com",
    "missing-domain@",
    "two@@ats.com",
    ".starts.with.dot@example.com",
    "ends.with.dot.@example.com",
    "user@-starts-with-dash.com",
    "user@ends-with-dash-.com",
    "user@exam..ple.com",
    "\"<script>\"@example.com",
    "admin'--@sqli.com",
    "user@example.com\nBcc: evil@hacker.com",
    "user+tag@example.com; rm -rf /",
    "",
    " ",
    "definitely_not_an_email"
];
const DIRTY_ADDRESSES = [
    // ── US Formats & Quirks ──
    "Apt 4B, 221B Baker St.\nAttn: Sherlock Holmes\nKnock 3 Times",
    "123-45 67th St, Fl 8, Ste 800-B",
    "Rural Route 2, Box 99A (Behind the red barn)",
    "P.O. Box #404 (Do not deliver on weekends)",
    "1600 Pennsylvania Avenue NW\nWashington, D.C. 20500",
    "1 Infinite Loop\nCupertino, CA 95014",
    "Highway 101 KM 42.5, Sector North",
    "Corner of 5th Ave & 42nd St",
    // ── International Formats ──
    "100-0001 東京都千代田区千代田1-1",
    "Palacio de La Moneda, Santiago, Chile",
    "Postfach 12 34 56, 10115 Berlin, Germany",
    "Somewhere over the rainbow, 00000",
    "5ème étage, 27 Rue de Fleurus, 75006 Paris, France",
    "Кремль, Москва, Россия, 103073",
    "서울특별시 중구 세종대로 110",
    "Av. Paulista, 1578 - Bela Vista\nSão Paulo - SP, 01310-200",
    "No. 1 Zhongshan East Road\n中山東路1號\nTaipei 100, Taiwan",
    "Victoria Pk Rd & Hing Fat St\nCauseway Bay, Hong Kong",
    // ── Postal Code Edge Cases ──
    "12345",
    "12345-6789",
    "00000",
    "99999-9999",
    "SW1A 1AA",
    "H0H 0H0",
    "110 001",
    // ── Adversarial ──
    "No street number, Island of Tristan da Cunha",
    "<script>alert('xss')</script>",
    "123 Main St; DROP TABLE addresses;--",
    "",
    " ",
    "N/A",
    "Unknown",
    "REDACTED",
    "123 Fake Street\n\n\n\nMultiple blank lines above",
    "Emoji House 🏠, Rainbow Road 🌈, Cloud City ☁️"
];
const DIRTY_PHONES = [
    // ── Valid International Formats ──
    "+1 (555) 019-2834",
    "+44 20 7946 0958",
    "+49 30 123456-0",
    "+81 3-1234-5678",
    "+86 10 1234 5678",
    "+91 98765 43210",
    "+7 495 123-45-67",
    "+33 1 23 45 67 89",
    "+55 11 91234-5678",
    "+82 2-123-4567",
    "+972 2-123-4567",
    // ── Extensions & Formatting Edge Cases ──
    "+1 (555) 019-2834 ext 999999999999",
    "555.019.2834",
    "5550192834",
    "(555) 019-2834",
    "555-019-2834",
    "+1-555-019-2834",
    "1-800-FLOWERS",
    "011-44-20-7946-0958",
    // ── Adversarial & Invalid ──
    "000-000-0000",
    "+0 000 000 0000",
    "911",
    "112",
    "",
    " ",
    "null",
    "NaN",
    "+1",
    "+".repeat(30),
    "phone",
    "((((((",
    "+1 555 0192834#24*99",
    "📱 Call Me Maybe",
    "+99 999 999 9999 9999 9999",
    "123"
];
const DIRTY_URLS = [
    // ── Valid but Tricky ──
    "https://example.com",
    "http://example.com:8080/path?query=value&other=123#fragment",
    "https://user:password@example.com:443/path",
    "https://subdomain.sub.example.co.uk/deeply/nested/path",
    "ftp://files.example.com/pub/",
    "https://example.com/path%20with%20spaces",
    "https://example.com/path?q=hello+world&lang=en",
    // ── Internationalized (IDN / Punycode) ──
    "https://xn--e1afmkfd.xn--p1ai",
    "https://例え.jp/テスト",
    "https://münchen.de/ünîcödé",
    "https://🏠.ws",
    // ── Localhost & Internal ──
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://0.0.0.0",
    "http://[::1]:3000",
    "http://169.254.169.254/latest/meta-data/",
    "http://metadata.google.internal/",
    // ── Adversarial & Injection ──
    "javascript:alert('XSS')",
    "data:text/html,<h1>injected</h1>",
    "https://evil.com/redirect?url=https://bank.com",
    "https://example.com/<script>alert(1)</script>",
    "https://example.com/path?q='; DROP TABLE users;--",
    "//protocol-relative.example.com",
    "https://example.com/path#<img onerror=alert(1) src=x>",
    // ── Boundary ──
    "",
    " ",
    "not_a_url",
    "http://",
    "://missing-protocol.com",
    "https://" + "a".repeat(2048) + ".com",
    "file:///etc/passwd",
    "\\\\network-share\\folder"
];
// ═══════════════════════════════════════════════════════════════════════════════
// CHAOS PRESETS — Curated Domain-Specific Edge-Case Generators
// ═══════════════════════════════════════════════════════════════════════════════
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
const CHAOS_PRESETS = [
    {
        id: 'ecommerce',
        name: 'E-Commerce Orders',
        description: 'Orders with high-entropy items, zero-amount promotions, extreme quantities, and multi-currency edge cases.',
        generate: (count, entropy)=>{
            const statuses = [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded_partially',
                'disputed',
                'chargeback_fraud_hold',
                'backordered',
                'lost_in_transit'
            ];
            const currencies = [
                'USD',
                'EUR',
                'JPY',
                'GBP',
                'VND',
                'BTC',
                'ETH',
                'KWD',
                'BHD',
                'OMR',
                'CLF',
                'XXX'
            ];
            const paymentMethods = [
                'visa_4242',
                'mastercard_5555',
                'amex_3782',
                'paypal',
                'apple_pay',
                'crypto_wallet',
                'bank_transfer',
                'cash_on_delivery',
                'buy_now_pay_later',
                'gift_card_partial'
            ];
            return Array.from({
                length: count
            }, (_, i)=>{
                const isDirty = Math.random() < entropy / 100;
                const qty = isDirty ? Math.random() > 0.5 ? 999999 : Math.random() > 0.5 ? 0 : -1 : Math.floor(Math.random() * 5) + 1;
                const price = isDirty ? Math.random() > 0.6 ? 0.00000001 : Math.random() > 0.3 ? -15.50 : Math.random() > 0.5 ? 9999999.99 : 0.1 + 0.2 : parseFloat((Math.random() * 200 + 5).toFixed(2));
                const discountPct = isDirty ? Math.random() > 0.5 ? 150 : Math.random() > 0.5 ? -10 : 0 : Math.floor(Math.random() * 30);
                return {
                    order_id: isDirty ? `ORD-${Math.random().toString(36).substring(2, 7)}-${i}-🚨` : `ORD-2026-${1000 + i}`,
                    customer_name: isDirty ? pickRandom(DIRTY_NAMES) : `Customer ${i + 1}`,
                    customer_email: isDirty ? pickRandom(DIRTY_EMAILS) : `user${i + 1}@store.io`,
                    shipping_address: isDirty ? pickRandom(DIRTY_ADDRESSES) : `${100 + i} Main St, Suite ${i}`,
                    shipping_phone: isDirty ? pickRandom(DIRTY_PHONES) : `+1-202-555-01${i < 10 ? '0' + i : i}`,
                    items_count: qty,
                    currency: pickRandom(currencies),
                    unit_price: price,
                    discount_percent: discountPct,
                    tax_rate: isDirty ? Math.random() > 0.5 ? 0.0 : 0.2857142857 : 0.08,
                    total_amount: parseFloat((qty * price * (1 - discountPct / 100)).toFixed(6)),
                    payment_method: pickRandom(paymentMethods),
                    order_status: pickRandom(statuses),
                    special_instructions: isDirty ? pickRandom(NAUGHTY_STRINGS) : "Leave at front desk.",
                    referral_url: isDirty ? pickRandom(DIRTY_URLS) : `https://store.io/product/${i + 1}`,
                    created_at: isDirty ? Math.random() > 0.5 ? "1970-01-01T00:00:00.000Z" : Math.random() > 0.5 ? "2038-01-19T03:14:07.000Z" : "0000-00-00T00:00:00Z" : new Date(Date.now() - i * 86400000).toISOString()
                };
            });
        }
    },
    {
        id: 'users',
        name: 'B2B Users & Identities',
        description: 'Profiles with complex multi-script names, exotic domains, edge-case phones, and role permissions.',
        generate: (count, entropy)=>{
            const roles = [
                'member',
                'admin',
                'billing_owner',
                'auditor',
                'suspended',
                'invited_pending',
                'bot_service_account',
                'super_admin',
                'read_only_viewer',
                'external_contractor'
            ];
            const timezones = [
                'America/New_York',
                'Europe/London',
                'Asia/Tokyo',
                'Asia/Kolkata',
                'Pacific/Auckland',
                'UTC',
                'Etc/GMT+12',
                'US/Samoa'
            ];
            const locales = [
                'en-US',
                'ja-JP',
                'zh-CN',
                'ar-SA',
                'he-IL',
                'de-DE',
                'pt-BR',
                'ko-KR',
                'hi-IN',
                'ru-RU'
            ];
            return Array.from({
                length: count
            }, (_, i)=>{
                const isDirty = Math.random() < entropy / 100;
                return {
                    user_id: isDirty ? `usr_${Math.random() > 0.5 ? 'null' : '00000000-0000-0000-0000-000000000000'}` : `usr_live_${1000 + i}`,
                    display_name: isDirty ? pickRandom(DIRTY_NAMES) : `Developer ${i + 1}`,
                    work_email: isDirty ? pickRandom(DIRTY_EMAILS) : `dev.${i + 1}@enterprise.tech`,
                    phone: isDirty ? pickRandom(DIRTY_PHONES) : `+1-202-555-01${i < 10 ? '0' + i : i}`,
                    bio_headline: isDirty ? pickRandom(NAUGHTY_STRINGS) : "Full-stack engineer building resilient web services.",
                    avatar_url: isDirty ? pickRandom(DIRTY_URLS) : `https://images.unsplash.com/photo-1534528741775?w=150`,
                    role: pickRandom(roles),
                    is_mfa_enabled: isDirty ? Math.random() > 0.5 ? null : false : true,
                    last_login_ip: isDirty ? Math.random() > 0.5 ? "::1" : Math.random() > 0.5 ? "256.0.0.1" : "0.0.0.0" : `192.168.1.${10 + i}`,
                    api_rate_limit: isDirty ? Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 999999999 : -1 : 5000,
                    preferred_locale: pickRandom(locales),
                    timezone: pickRandom(timezones),
                    verified: isDirty ? Math.random() > 0.7 ? null : false : true,
                    signup_referrer: isDirty ? pickRandom(DIRTY_URLS) : "https://enterprise.tech/signup",
                    last_login_at: isDirty ? Math.random() > 0.5 ? "1970-01-01T00:00:00.000Z" : null : new Date(Date.now() - i * 3600000).toISOString()
                };
            });
        }
    },
    {
        id: 'financial',
        name: 'Invoices & Billing Transactions',
        description: 'Financial transactions with floating-point anomalies, negative fees, high-decimal crypto rates, and chargebacks.',
        generate: (count, entropy)=>{
            const types = [
                'subscription',
                'usage_metered',
                'credit_adjustment',
                'refund_chargeback',
                'proration_credit',
                'one_time_setup',
                'overage_charge',
                'tax_adjustment',
                'wire_transfer_fee'
            ];
            const paymentStatuses = [
                'authorized',
                'captured',
                'settled',
                'failed',
                'declined',
                'refunded',
                'partially_refunded',
                'disputed',
                'void',
                'pending_3ds'
            ];
            return Array.from({
                length: count
            }, (_, i)=>{
                const isDirty = Math.random() < entropy / 100;
                const subtotal = isDirty ? Math.random() > 0.5 ? 0.1 + 0.2 : Math.random() > 0.5 ? -45.00 : 0 : parseFloat((Math.random() * 1500 + 20).toFixed(2));
                return {
                    invoice_number: isDirty ? `INV-${i}-#%&*` : `INV-2026-${5000 + i}`,
                    billing_type: pickRandom(types),
                    customer_name: isDirty ? pickRandom(DIRTY_NAMES) : `Client Corp ${i + 1}`,
                    customer_email: isDirty ? pickRandom(DIRTY_EMAILS) : `billing${i + 1}@client.co`,
                    subtotal: subtotal,
                    discount_amount: isDirty ? Math.random() > 0.5 ? subtotal * 1.5 : Math.random() > 0.5 ? -20 : 0.0 : 10.00,
                    processing_fee: isDirty ? Math.random() > 0.5 ? 0.0000000000000001 : -0.50 : 2.50,
                    tax_amount: isDirty ? Math.random() > 0.5 ? NaN : -8.25 : parseFloat((subtotal * 0.08).toFixed(2)),
                    currency_code: isDirty ? Math.random() > 0.5 ? "SAT" : Math.random() > 0.5 ? "XXX" : "" : "USD",
                    exchange_rate: isDirty ? Math.random() > 0.5 ? 0.0000123456789 : Infinity : 1.0,
                    payment_status: pickRandom(paymentStatuses),
                    payment_method_last4: isDirty ? Math.random() > 0.5 ? "0000" : "****" : `${1000 + i % 9000}`,
                    memo_notes: isDirty ? pickRandom(NAUGHTY_STRINGS) : "Monthly cloud platform usage invoice.",
                    is_delinquent: isDirty ? true : false,
                    due_date: isDirty ? Math.random() > 0.5 ? "0000-00-00" : "9999-12-31" : new Date(Date.now() + (30 - i) * 86400000).toISOString().split('T')[0]
                };
            });
        }
    },
    {
        id: 'naughty',
        name: 'BLNS Naughty Strings Suite',
        description: 'Direct injection of the Big List of Naughty Strings covering Unicode, SQL injection strings, XSS fragments, and RTL overrides.',
        generate: (count, _entropy)=>{
            return Array.from({
                length: count
            }, (_, i)=>{
                const stringVal = NAUGHTY_STRINGS[i % NAUGHTY_STRINGS.length];
                return {
                    index: i + 1,
                    category: categorizeNaughtyString(i),
                    raw_payload: stringVal,
                    character_length: stringVal.length,
                    utf16_code_units: stringVal.length,
                    byte_length: new TextEncoder().encode(stringVal).length,
                    contains_newlines: stringVal.includes('\n') || stringVal.includes('\r'),
                    contains_zero_width: /[\u200B\u200C\u200D\uFEFF]/.test(stringVal),
                    contains_rtl: /[\u202E\u202D\u200F\u200E]/.test(stringVal),
                    is_injection_risk: /<script|DROP TABLE|UNION SELECT|javascript:|onerror=|onload=/.test(stringVal),
                    is_empty_or_whitespace: stringVal.trim() === ''
                };
            });
        }
    }
];
function categorizeNaughtyString(index) {
    if (index < 10) return "Zero-Width & Invisible";
    if (index < 16) return "RTL / Directionality";
    if (index < 23) return "Diacritics & Zalgo";
    if (index < 34) return "Emoji & Multi-Byte";
    if (index < 42) return "Script Mixing";
    if (index < 50) return "Boundary Lengths";
    if (index < 68) return "Injection Patterns";
    if (index < 88) return "Null & Falsy Values";
    if (index < 97) return "Format-Breaking Characters";
    return "Homoglyph Confusables";
}
function exportData(data, format) {
    if (!data || data.length === 0) return '';
    switch(format){
        case 'json':
            return JSON.stringify(data, null, 2);
        case 'csv':
            {
                const headers = Object.keys(data[0]);
                const csvRows = [
                    headers.map((h)=>`"${h.replace(/"/g, '""')}"`).join(',')
                ];
                for (const row of data){
                    const values = headers.map((header)=>{
                        const val = row[header];
                        if (val === null || val === undefined) return '""';
                        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        return `"${stringVal.replace(/"/g, '""')}"`;
                    });
                    csvRows.push(values.join(','));
                }
                return csvRows.join('\n');
            }
        case 'typescript':
            {
                const sample = data[0];
                const inferType = (val)=>{
                    if (val === null) return 'string | null';
                    if (typeof val === 'number') return 'number';
                    if (typeof val === 'boolean') return 'boolean';
                    if (Array.isArray(val)) return 'any[]';
                    if (typeof val === 'object') return 'Record<string, any>';
                    return 'string';
                };
                const fields = Object.entries(sample).map(([key, val])=>`  ${key}: ${inferType(val)};`).join('\n');
                return `export interface GeneratedMockItem {\n${fields}\n}\n\nexport const MOCK_DATA: GeneratedMockItem[] = ${JSON.stringify(data, null, 2)};`;
            }
        case 'zod':
            {
                const sample = data[0];
                const inferZod = (val)=>{
                    if (val === null) return 'z.string().nullable()';
                    if (typeof val === 'number') return 'z.number()';
                    if (typeof val === 'boolean') return 'z.boolean()';
                    if (Array.isArray(val)) return 'z.array(z.any())';
                    if (typeof val === 'object') return 'z.record(z.any())';
                    return 'z.string()';
                };
                const fields = Object.entries(sample).map(([key, val])=>`  ${key}: ${inferZod(val)},`).join('\n');
                return `import { z } from 'zod';\n\nexport const MockItemSchema = z.object({\n${fields}\n});\n\nexport type MockItem = z.infer<typeof MockItemSchema>;`;
            }
        default:
            return JSON.stringify(data, null, 2);
    }
}
}),
"[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SchemaBuilderUtility",
    ()=>SchemaBuilderUtility
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/schema-builder/schemaFieldGenerators.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-ssr] (ecmascript) <export default as Layers>");
;
;
;
;
const STORAGE_KEY = 'failstate-custom-schema';
const SchemaBuilderUtility = ()=>{
    // Load saved fields or default to User Profile template
    const [fields, setFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch  {
        // Fallback
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOMAIN_TEMPLATES"][0].fields;
    });
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(25);
    const [globalEntropy, setGlobalEntropy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(65);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('table');
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [seed, setSeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Persist fields in localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
        } catch  {
        // Ignore quota errors
        }
    }, [
        fields
    ]);
    // Global hotkey: R to re-roll
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if ((e.key === 'r' || e.key === 'R') && ![
                'INPUT',
                'TEXTAREA'
            ].includes(e.target.tagName)) {
                setSeed((s)=>s + 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, []);
    // Generate records
    const generatedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        void seed;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateFromSchema"])(fields, count, globalEntropy);
    }, [
        fields,
        count,
        globalEntropy,
        seed
    ]);
    const currentExportFormat = viewMode === 'table' ? 'json' : viewMode;
    const exportedString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportSchemaData"])(generatedData, currentExportFormat);
    }, [
        generatedData,
        currentExportFormat
    ]);
    const payloadByteSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return new TextEncoder().encode(exportedString).length;
    }, [
        exportedString
    ]);
    const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!generatedData || generatedData.length === 0) return [];
        return Object.keys(generatedData[0]);
    }, [
        generatedData
    ]);
    // Field manipulation helpers
    const handleAddField = ()=>{
        const newField = {
            id: `f_${Date.now()}`,
            name: `field_${fields.length + 1}`,
            type: 'name',
            chaosLevel: 60
        };
        setFields((prev)=>[
                ...prev,
                newField
            ]);
    };
    const handleUpdateField = (id, updates)=>{
        setFields((prev)=>prev.map((f)=>f.id === id ? {
                    ...f,
                    ...updates
                } : f));
    };
    const handleRemoveField = (id)=>{
        if (fields.length <= 1) return; // Maintain at least 1 field
        setFields((prev)=>prev.filter((f)=>f.id !== id));
    };
    const handleApplyTemplate = (templateId)=>{
        const template = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOMAIN_TEMPLATES"].find((t)=>t.id === templateId);
        if (template) {
            setFields(template.fields);
        }
    };
    const handleCopy = ()=>{
        navigator.clipboard.writeText(exportedString);
        setCopied(true);
        setTimeout(()=>setCopied(false), 1500);
    };
    const handleDownload = ()=>{
        const extMap = {
            json: 'json',
            csv: 'csv',
            typescript: 'ts',
            zod: 'ts',
            sql: 'sql'
        };
        const ext = extMap[currentExportFormat] || 'json';
        const blob = new Blob([
            exportedString
        ], {
            type: 'text/plain;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `custom-schema-${Date.now()}.${ext}`;
        link.click();
        URL.revokeObjectURL(url);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col gap-3 font-mono",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] uppercase mr-1 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "w-3.5 h-3.5 text-rose-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Templates:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOMAIN_TEMPLATES"].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleApplyTemplate(t.id),
                                    className: "px-2.5 py-1 text-xs rounded transition-colors shrink-0 bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40",
                                    title: t.description,
                                    children: t.name
                                }, t.id, false, {
                                    fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[var(--text-muted)] px-1.5 text-[10px]",
                                        children: "ROWS:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    [
                                        10,
                                        25,
                                        50,
                                        100
                                    ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCount(n),
                                            className: `px-2 py-0.5 rounded text-[11px] transition-colors ${count === n ? 'bg-black/10 dark:bg-white/10 text-cyan-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`,
                                            children: n
                                        }, n, false, {
                                            fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                            lineNumber: 167,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[var(--text-muted)] text-[10px]",
                                        children: "GLOBAL CHAOS:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: "0",
                                        max: "100",
                                        value: globalEntropy,
                                        onChange: (e)=>setGlobalEntropy(Number(e.target.value)),
                                        className: "w-20 accent-rose-500 cursor-pointer h-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `font-bold text-[11px] ${globalEntropy > 70 ? 'text-rose-500' : 'text-cyan-500'}`,
                                        children: [
                                            globalEntropy,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 192,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSeed((s)=>s + 1),
                                        title: "Re-roll permutations (Hotkey: R)",
                                        className: "px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 flex items-center gap-1 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 204,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Re-roll (R)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 205,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCopy,
                                        className: "px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors",
                                        children: [
                                            copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-3.5 h-3.5 text-emerald-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 212,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 212,
                                                columnNumber: 85
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: copied ? 'Copied' : 'Copy'
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 213,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleDownload,
                                        title: "Download generated payload",
                                        className: "p-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                            lineNumber: 221,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-5 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg flex flex-col overflow-hidden shadow-sm transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border-b border-[var(--border-dev)] flex items-center justify-between bg-[var(--bg-panel-subtle)] shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                className: "w-4 h-4 text-rose-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 234,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-bold text-[var(--text-primary)] uppercase",
                                                children: "Schema Fields"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 235,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] font-bold",
                                                children: fields.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleAddField,
                                        className: "px-2 py-1 text-xs font-semibold rounded bg-rose-500 text-white hover:bg-rose-600 flex items-center gap-1 transition-colors shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 245,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Add Field"
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 246,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto p-2.5 flex flex-col gap-2",
                                children: fields.map((field, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2.5 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] flex flex-col gap-2 group hover:border-rose-500/40 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-[var(--text-muted)] font-bold w-4 select-none",
                                                        children: [
                                                            "#",
                                                            idx + 1
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: field.name,
                                                        onChange: (e)=>handleUpdateField(field.id, {
                                                                name: e.target.value.replace(/\s+/g, '_')
                                                            }),
                                                        placeholder: "field_name",
                                                        className: "dev-input flex-1 px-2 py-1 rounded text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: field.type,
                                                        onChange: (e)=>handleUpdateField(field.id, {
                                                                type: e.target.value
                                                            }),
                                                        className: "dev-input px-2 py-1 rounded text-xs bg-[var(--bg-sidebar)] max-w-[140px]",
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVAILABLE_FIELD_TYPES"].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: type.id,
                                                                children: type.label
                                                            }, type.id, false, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleRemoveField(field.id),
                                                        disabled: fields.length <= 1,
                                                        title: fields.length <= 1 ? "At least one field is required" : "Delete field",
                                                        className: "p-1 rounded text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 disabled:opacity-30 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            className: "w-3.5 h-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                            lineNumber: 291,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            field.type === 'enum' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 pl-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-[var(--text-muted)] shrink-0",
                                                        children: "Values:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: field.options || 'active, pending, suspended',
                                                        onChange: (e)=>handleUpdateField(field.id, {
                                                                options: e.target.value
                                                            }),
                                                        placeholder: "e.g. pending, active, cancelled",
                                                        className: "dev-input flex-1 px-2 py-0.5 rounded text-[11px]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 297,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-3 pl-6 pt-1 border-t border-[var(--border-dev-subtle)] text-[11px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 text-[var(--text-muted)]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                                className: "w-3 h-3 text-rose-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 312,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px]",
                                                                children: "Field Chaos:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 flex-1 max-w-[180px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "range",
                                                                min: "0",
                                                                max: "100",
                                                                value: field.chaosLevel,
                                                                onChange: (e)=>handleUpdateField(field.id, {
                                                                        chaosLevel: Number(e.target.value)
                                                                    }),
                                                                className: "w-full accent-rose-500 cursor-pointer h-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 317,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `text-[10px] font-bold w-7 text-right ${field.chaosLevel > 70 ? 'text-rose-500' : 'text-cyan-500'}`,
                                                                children: [
                                                                    field.chaosLevel,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 325,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, field.id, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-2 border-t border-[var(--border-dev)] bg-[var(--bg-panel-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Saved in localStorage"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            localStorage.removeItem(STORAGE_KEY);
                                            setFields(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$schema$2d$builder$2f$schemaFieldGenerators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOMAIN_TEMPLATES"][0].fields);
                                        },
                                        className: "hover:text-rose-500 text-[10px] underline",
                                        children: "Reset to Defaults"
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-7 flex flex-col gap-2 min-h-0 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-xs shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 bg-[var(--bg-panel)] p-0.5 rounded border border-[var(--border-dev)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setViewMode('table'),
                                                className: `px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "w-3.5 h-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Table Grid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 354,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            [
                                                'json',
                                                'typescript',
                                                'zod',
                                                'csv',
                                                'sql'
                                            ].map((fmt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setViewMode(fmt),
                                                    className: `px-2 py-1 rounded text-xs uppercase transition-colors ${viewMode === fmt ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`,
                                                    children: fmt
                                                }, fmt, false, {
                                                    fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                    lineNumber: 366,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 353,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 text-[var(--text-muted)] text-[11px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "cols: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "text-[var(--text-primary)]",
                                                        children: columns.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 381,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "size: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "text-cyan-500",
                                                        children: [
                                                            (payloadByteSize / 1024).toFixed(1),
                                                            " KB"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 382,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-h-0 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg overflow-hidden flex flex-col shadow-sm",
                                children: viewMode === 'table' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "dev-table",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                width: '45px'
                                                            },
                                                            children: "#"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: col
                                                            }, col, false, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 395,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 391,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: generatedData.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "text-[var(--text-muted)] select-none font-bold",
                                                                children: idx + 1
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            columns.map((col)=>{
                                                                const val = row[col];
                                                                const isNull = val === null || val === undefined;
                                                                const isNum = typeof val === 'number';
                                                                const display = typeof val === 'object' ? JSON.stringify(val) : String(val);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "max-w-xs truncate",
                                                                    title: display,
                                                                    children: isNull ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-rose-500 font-semibold italic",
                                                                        children: "null"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                        lineNumber: 412,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)) : isNum ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-emerald-600 dark:text-emerald-300",
                                                                        children: display
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                        lineNumber: 414,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[var(--text-primary)]",
                                                                        children: display
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                        lineNumber: 416,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, col, false, {
                                                                    fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                                    lineNumber: 410,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0));
                                                            })
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                                lineNumber: 399,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 390,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                    lineNumber: 389,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-auto p-4 font-mono text-xs text-[var(--text-code)] leading-relaxed bg-[var(--bg-codebox)]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "m-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            children: exportedString
                                        }, void 0, false, {
                                            fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                            lineNumber: 429,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                        lineNumber: 428,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                    lineNumber: 427,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/utilities/schema-builder/SchemaBuilderUtility.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/utilities/schema-builder/schemaFieldGenerators.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AVAILABLE_FIELD_TYPES",
    ()=>AVAILABLE_FIELD_TYPES,
    "DOMAIN_TEMPLATES",
    ()=>DOMAIN_TEMPLATES,
    "exportSchemaData",
    ()=>exportSchemaData,
    "generateFieldValue",
    ()=>generateFieldValue,
    "generateFromSchema",
    ()=>generateFromSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/chaos-data/chaosDataEngine.ts [app-ssr] (ecmascript)");
;
const AVAILABLE_FIELD_TYPES = [
    {
        id: 'uuid',
        label: 'UUID / ID',
        category: 'Identity',
        defaultName: 'id',
        description: 'v4 UUIDs, zero-UUIDs, null representations'
    },
    {
        id: 'name',
        label: 'Full Name',
        category: 'Identity',
        defaultName: 'full_name',
        description: 'Multilingual, diacritics, untrimmed, compound names'
    },
    {
        id: 'email',
        label: 'Email Address',
        category: 'Contact',
        defaultName: 'email',
        description: 'Nested tags, unicode domains, extreme length'
    },
    {
        id: 'address',
        label: 'Mailing Address',
        category: 'Contact',
        defaultName: 'address',
        description: 'Multiline street lines, international formats'
    },
    {
        id: 'phone',
        label: 'Phone Number',
        category: 'Contact',
        defaultName: 'phone',
        description: 'International country codes, extensions, bad formatting'
    },
    {
        id: 'integer',
        label: 'Integer',
        category: 'Numeric',
        defaultName: 'quantity',
        description: 'Min/max boundaries, negative, zero, overflows'
    },
    {
        id: 'float',
        label: 'Float / Currency',
        category: 'Numeric',
        defaultName: 'amount',
        description: '0.1+0.2 precision traps, 18-decimal fractions'
    },
    {
        id: 'boolean',
        label: 'Boolean Flag',
        category: 'System',
        defaultName: 'is_active',
        description: 'true/false with null and falsy string anomalies'
    },
    {
        id: 'date',
        label: 'Date / Timestamp',
        category: 'System',
        defaultName: 'created_at',
        description: 'Epoch 0, Y2038 bug, timezone offset traps'
    },
    {
        id: 'enum',
        label: 'Enum / Status',
        category: 'System',
        defaultName: 'status',
        description: 'Configurable options with stray values'
    },
    {
        id: 'url',
        label: 'Web URL',
        category: 'System',
        defaultName: 'website_url',
        description: 'Punycode, query param floods, localhost'
    },
    {
        id: 'naughty',
        label: 'Naughty String (BLNS)',
        category: 'Complex',
        defaultName: 'notes',
        description: 'Unicode zalgo, script injection fragments'
    },
    {
        id: 'json_blob',
        label: 'JSON Metadata',
        category: 'Complex',
        defaultName: 'metadata',
        description: 'Nested objects, recursive traps, null values'
    }
];
const DOMAIN_TEMPLATES = [
    {
        id: 'user-profile',
        name: 'User Profile & Auth',
        description: 'User accounts with names, emails, roles, phone, and MFA flags.',
        fields: [
            {
                id: 'f_1',
                name: 'user_id',
                type: 'uuid',
                chaosLevel: 50
            },
            {
                id: 'f_2',
                name: 'full_name',
                type: 'name',
                chaosLevel: 75
            },
            {
                id: 'f_3',
                name: 'email',
                type: 'email',
                chaosLevel: 70
            },
            {
                id: 'f_4',
                name: 'phone_number',
                type: 'phone',
                chaosLevel: 60
            },
            {
                id: 'f_5',
                name: 'role',
                type: 'enum',
                chaosLevel: 40,
                options: 'member, admin, auditor, suspended, guest'
            },
            {
                id: 'f_6',
                name: 'is_verified',
                type: 'boolean',
                chaosLevel: 30
            },
            {
                id: 'f_7',
                name: 'registered_at',
                type: 'date',
                chaosLevel: 50
            }
        ]
    },
    {
        id: 'ecommerce-item',
        name: 'E-Commerce Product',
        description: 'Products with SKUs, titles, inventory counts, and prices.',
        fields: [
            {
                id: 'f_1',
                name: 'product_id',
                type: 'uuid',
                chaosLevel: 30
            },
            {
                id: 'f_2',
                name: 'sku',
                type: 'enum',
                chaosLevel: 50,
                options: 'SKU-001, SKU-002-TEST, SKU-PROMO-99'
            },
            {
                id: 'f_3',
                name: 'product_name',
                type: 'name',
                chaosLevel: 80
            },
            {
                id: 'f_4',
                name: 'price',
                type: 'float',
                chaosLevel: 70
            },
            {
                id: 'f_5',
                name: 'stock_quantity',
                type: 'integer',
                chaosLevel: 65
            },
            {
                id: 'f_6',
                name: 'in_stock',
                type: 'boolean',
                chaosLevel: 40
            },
            {
                id: 'f_7',
                name: 'product_url',
                type: 'url',
                chaosLevel: 50
            }
        ]
    },
    {
        id: 'transaction-record',
        name: 'Billing Transaction',
        description: 'Ledger entries with amounts, currency codes, status, and notes.',
        fields: [
            {
                id: 'f_1',
                name: 'transaction_id',
                type: 'uuid',
                chaosLevel: 40
            },
            {
                id: 'f_2',
                name: 'customer_email',
                type: 'email',
                chaosLevel: 60
            },
            {
                id: 'f_3',
                name: 'amount',
                type: 'float',
                chaosLevel: 85
            },
            {
                id: 'f_4',
                name: 'currency',
                type: 'enum',
                chaosLevel: 50,
                options: 'USD, EUR, GBP, JPY, BTC, KWD'
            },
            {
                id: 'f_5',
                name: 'status',
                type: 'enum',
                chaosLevel: 45,
                options: 'authorized, captured, failed, refunded, disputed'
            },
            {
                id: 'f_6',
                name: 'timestamp',
                type: 'date',
                chaosLevel: 60
            },
            {
                id: 'f_7',
                name: 'notes',
                type: 'naughty',
                chaosLevel: 90
            }
        ]
    },
    {
        id: 'api-response',
        name: 'API Telemetry & Logs',
        description: 'API request diagnostics, latency metrics, and payload metadata.',
        fields: [
            {
                id: 'f_1',
                name: 'request_id',
                type: 'uuid',
                chaosLevel: 30
            },
            {
                id: 'f_2',
                name: 'status_code',
                type: 'integer',
                chaosLevel: 60
            },
            {
                id: 'f_3',
                name: 'endpoint',
                type: 'url',
                chaosLevel: 55
            },
            {
                id: 'f_4',
                name: 'latency_ms',
                type: 'float',
                chaosLevel: 75
            },
            {
                id: 'f_5',
                name: 'timestamp',
                type: 'date',
                chaosLevel: 40
            },
            {
                id: 'f_6',
                name: 'payload_metadata',
                type: 'json_blob',
                chaosLevel: 80
            }
        ]
    }
];
// Helper to generate a clean v4 UUID
function generateCleanUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
function generateFieldValue(field, globalEntropy, rowIndex) {
    // Effective chaos is a combination of field-level and global entropy
    const effectiveChaos = Math.min(100, Math.max(0, field.chaosLevel * 0.6 + globalEntropy * 0.4));
    const isDirty = Math.random() < effectiveChaos / 100;
    switch(field.type){
        case 'uuid':
            if (isDirty) {
                const roll = Math.random();
                if (roll < 0.25) return '00000000-0000-0000-0000-000000000000';
                if (roll < 0.5) return 'null';
                if (roll < 0.75) return generateCleanUuid().toUpperCase();
                return `uuid_${Math.random().toString(36).substring(2, 8)}_invalid_len`;
            }
            return generateCleanUuid();
        case 'name':
            if (isDirty) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_NAMES"][Math.floor(Math.random() * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_NAMES"].length)];
            }
            return `User ${rowIndex + 1}`;
        case 'email':
            if (isDirty) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_EMAILS"][Math.floor(Math.random() * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_EMAILS"].length)];
            }
            return `user${rowIndex + 1}@example.com`;
        case 'address':
            if (isDirty) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_ADDRESSES"][Math.floor(Math.random() * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_ADDRESSES"].length)];
            }
            return `${100 + rowIndex} Broadway Ave, Apt ${rowIndex + 1}`;
        case 'phone':
            if (isDirty) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_PHONES"][Math.floor(Math.random() * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_PHONES"].length)];
            }
            return `+1-202-555-01${rowIndex < 10 ? '0' + rowIndex : rowIndex}`;
        case 'integer':
            if (isDirty) {
                const roll = Math.random();
                if (roll < 0.25) return 0;
                if (roll < 0.5) return -1;
                if (roll < 0.75) return 999999999;
                return null;
            }
            return Math.floor(Math.random() * 100) + 1;
        case 'float':
            if (isDirty) {
                const roll = Math.random();
                if (roll < 0.3) return 0.1 + 0.2; // Javascript precision trap: 0.30000000000000004
                if (roll < 0.55) return -49.99; // Negative price
                if (roll < 0.75) return 0.00000001; // Tiny crypto fraction
                if (roll < 0.9) return 99999999.99;
                return null;
            }
            return parseFloat((Math.random() * 100 + 5).toFixed(2));
        case 'boolean':
            if (isDirty) {
                const roll = Math.random();
                if (roll < 0.35) return null;
                if (roll < 0.65) return rowIndex % 2 === 0;
                return false;
            }
            return Math.random() > 0.5;
        case 'date':
            if (isDirty) {
                const roll = Math.random();
                if (roll < 0.3) return '1970-01-01T00:00:00.000Z'; // Unix epoch 0
                if (roll < 0.6) return '2038-01-19T03:14:07.000Z'; // 32-bit timestamp overflow
                if (roll < 0.8) return '9999-12-31T23:59:59.999Z'; // Far future
                return '0000-00-00T00:00:00Z'; // Invalid date format
            }
            return new Date(Date.now() - rowIndex * 86400000).toISOString();
        case 'enum':
            {
                const options = (field.options || 'active, pending, suspended').split(',').map((s)=>s.trim()).filter(Boolean);
                const safeOptions = options.length > 0 ? options : [
                    'default_1',
                    'default_2'
                ];
                if (isDirty) {
                    const roll = Math.random();
                    if (roll < 0.35) return safeOptions[0].toUpperCase();
                    if (roll < 0.6) return 'UNKNOWN_STATUS_CODE';
                    if (roll < 0.8) return '';
                    return null;
                }
                return safeOptions[rowIndex % safeOptions.length];
            }
        case 'url':
            if (isDirty) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_URLS"][Math.floor(Math.random() * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DIRTY_URLS"].length)];
            }
            return `https://cdn.example.com/assets/${rowIndex + 1}.png`;
        case 'naughty':
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NAUGHTY_STRINGS"][(rowIndex + Math.floor(Math.random() * 5)) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$chaos$2d$data$2f$chaosDataEngine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NAUGHTY_STRINGS"].length];
        case 'json_blob':
            if (isDirty) {
                const roll = Math.random();
                if (roll < 0.3) return {
                    _error: "Unhandled circular or deep nest",
                    depth: 99,
                    keys: null
                };
                if (roll < 0.6) return {};
                if (roll < 0.8) return {
                    tags: [
                        "\u200Bzero_width",
                        "🚀".repeat(10)
                    ]
                };
                return null;
            }
            return {
                tag: `item_${rowIndex + 1}`,
                active: true,
                retries: rowIndex
            };
        default:
            return `Val_${rowIndex + 1}`;
    }
}
function generateFromSchema(fields, count, globalEntropy) {
    if (!fields || fields.length === 0) return [];
    return Array.from({
        length: count
    }, (_, rowIdx)=>{
        const row = {};
        for (const field of fields){
            const key = field.name.trim() || `field_${field.id}`;
            row[key] = generateFieldValue(field, globalEntropy, rowIdx);
        }
        return row;
    });
}
function exportSchemaData(data, format) {
    if (!data || data.length === 0) return '';
    switch(format){
        case 'json':
            return JSON.stringify(data, null, 2);
        case 'csv':
            {
                const headers = Object.keys(data[0]);
                const csvRows = [
                    headers.map((h)=>`"${h.replace(/"/g, '""')}"`).join(',')
                ];
                for (const row of data){
                    const values = headers.map((header)=>{
                        const val = row[header];
                        if (val === null || val === undefined) return '""';
                        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        return `"${stringVal.replace(/"/g, '""')}"`;
                    });
                    csvRows.push(values.join(','));
                }
                return csvRows.join('\n');
            }
        case 'typescript':
            {
                const sample = data[0];
                const inferType = (val)=>{
                    if (val === null) return 'string | null';
                    if (typeof val === 'number') return 'number';
                    if (typeof val === 'boolean') return 'boolean';
                    if (Array.isArray(val)) return 'any[]';
                    if (typeof val === 'object') return 'Record<string, any>';
                    return 'string';
                };
                const fields = Object.entries(sample).map(([key, val])=>`  ${key}: ${inferType(val)};`).join('\n');
                return `export interface CustomDataRecord {\n${fields}\n}\n\nexport const MOCK_RECORDS: CustomDataRecord[] = ${JSON.stringify(data, null, 2)};`;
            }
        case 'zod':
            {
                const sample = data[0];
                const inferZod = (val)=>{
                    if (val === null) return 'z.string().nullable()';
                    if (typeof val === 'number') return 'z.number().nullable()';
                    if (typeof val === 'boolean') return 'z.boolean().nullable()';
                    if (Array.isArray(val)) return 'z.array(z.any())';
                    if (typeof val === 'object') return 'z.record(z.any()).nullable()';
                    return 'z.string()';
                };
                const fields = Object.entries(sample).map(([key, val])=>`  ${key}: ${inferZod(val)},`).join('\n');
                return `import { z } from 'zod';\n\nexport const CustomRecordSchema = z.object({\n${fields}\n});\n\nexport type CustomRecord = z.infer<typeof CustomRecordSchema>;`;
            }
        case 'sql':
            {
                const tableName = 'custom_mock_data';
                const headers = Object.keys(data[0]);
                const columnsList = headers.map((h)=>`"${h}"`).join(', ');
                const valuesLines = data.map((row)=>{
                    const vals = headers.map((header)=>{
                        const val = row[header];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'number') return isNaN(val) ? 'NULL' : String(val);
                        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
                        const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        return `'${str.replace(/'/g, "''")}'`;
                    });
                    return `  (${vals.join(', ')})`;
                });
                return `INSERT INTO ${tableName} (${columnsList})\nVALUES\n${valuesLines.join(',\n')};`;
            }
        default:
            return JSON.stringify(data, null, 2);
    }
}
}),
];

//# sourceMappingURL=src_1_xn5i7._.js.map