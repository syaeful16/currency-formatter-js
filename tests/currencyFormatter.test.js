import CurrencyFormatter from "../src/currencyFormatter.js";

describe("CurrencyFormatter", () => {
    test("formats basic currency with prefix", () => {
        const rupiah = new CurrencyFormatter("Rp|#.###,##");
        expect(rupiah(1234567.89)).toBe("Rp 1.234.567,89");
    });

    test("formats with suffix", () => {
        const usd = new CurrencyFormatter("#,###.##|USD");
        expect(usd(1234567.89)).toBe("1,234,567.89 USD");
    });
});