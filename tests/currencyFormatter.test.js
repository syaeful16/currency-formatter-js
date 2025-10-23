import CurrencyFormatter from "../src/currencyFormatter.js";

describe("CurrencyFormatter", () => {
    // --- BASIC FORMATTING TESTS ---
    test("formats basic currency with prefix", () => {
        const rupiah = new CurrencyFormatter("Rp|#.###,##");
        expect(rupiah(1234567.89)).toBe("Rp 1.234.567,89");
    });

    test("formats with suffix", () => {
        const usd = new CurrencyFormatter("#,###.##|USD");
        expect(usd(1234567.89)).toBe("1,234,567.89 USD");
    });

    test("handles negative value with default '-' style", () => {
        const usd = new CurrencyFormatter("#,###.##");
        expect(usd(-1234567.89)).toBe("-1,234,567.89");
    });

    test("handles negative value with parentheses style", () => {
        const usd = new CurrencyFormatter("#,###.##", "()");
        expect(usd(-1234.56)).toBe("(1,234.56)");
    });

    test("formats zero and empty input correctly", () => {
        const rupiah = new CurrencyFormatter("Rp|#.###,##");
        expect(rupiah(0)).toBe("Rp 0,00");
        expect(rupiah("")).toBe("Rp 0,00");
        expect(rupiah(null)).toBe("Rp 0,00");
        expect(rupiah(undefined)).toBe("Rp 0,00");
    });

    // --- FORMAT CHANGING METHODS ---
    test("setFormat updates pattern correctly", () => {
        const fmt = new CurrencyFormatter();
        fmt.setFormat("#,###.#|USD");
        expect(fmt(1000.5)).toBe("1,000.5 USD");
    });

    test("setNegativeStyle updates style correctly", () => {
        const fmt = new CurrencyFormatter("#,###.#");
        fmt.setNegativeStyle("()");
        expect(fmt(-1234.5)).toBe("(1,234.5)");
    });

    // --- DIRECT FORMAT METHOD ---
    test("format() applies custom pattern override", () => {
        const fmt = new CurrencyFormatter("Rp|#.###,##");
        expect(fmt.format(1234.56, "#,###.##|USD")).toBe("1,234.56 USD");
    });

    // --- AUTO DETECTION ---
    test("auto() formats according to locale (id-ID)", () => {
        const fmt = new CurrencyFormatter();
        expect(fmt.auto(1234.56, "id-ID")).toBe("Rp 1.234,56");
    });

    test("auto() formats according to locale (en-US)", () => {
        const fmt = new CurrencyFormatter();
        expect(fmt.auto(1234.56, "en-US")).toBe("1,234.56 $");
    });

    test("auto() formats according to locale (ja-JP)", () => {
        const fmt = new CurrencyFormatter();
        expect(fmt.auto(9876543, "ja-JP")).toBe("9,876,543.00 ¥");
    });

    // --- PARSE METHOD ---
    test("parse() extracts numeric value correctly", () => {
        const fmt = new CurrencyFormatter();
        expect(fmt.parse("Rp 1.234,56")).toBe(1234.56);
        expect(fmt.parse("-1,234.56 USD")).toBe(-1234.56);
        expect(fmt.parse("text")).toBe(0);
    });

    // --- EDGE CASES ---
    test("handles non-numeric and malformed inputs safely", () => {
        const fmt = new CurrencyFormatter("Rp|#.###,#");
        expect(fmt("abc")).toBe("Rp 0,0");
        expect(fmt("Rp 1.000,50")).toBe("Rp 1.000,5");
    });
});