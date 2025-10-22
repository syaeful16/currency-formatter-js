import { terser } from "rollup-plugin-terser";

export default [
    // UMD (browser/CDN)
    {
        input: "src/currencyFormatter.js",
        output: {
            file: "dist/currencyFormatter.js",
            format: "umd",
            name: "CurrencyFormatter",
            exports: "default"
        },
        plugins: [terser()]
    },
    // ESM (import/export)
    {
        input: "src/currencyFormatter.js",
        output: {
            file: "dist/currencyFormatter.mjs",
            format: "es"
        },
        plugins: [terser()]
    }
];
