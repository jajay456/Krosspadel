import { describe, it, expect } from "vitest";
import { locationWord, formatDate } from "./venueUtils";

describe("locationWord", () => {
    it("แปลง 0–10 เป็นคำภาษาอังกฤษ", () => {
        expect(locationWord(0)).toBe("Zero");
        expect(locationWord(1)).toBe("One");
        expect(locationWord(4)).toBe("Four");
        expect(locationWord(10)).toBe("Ten");
    });

    it("ตัวเลขเกิน 10 คืนเป็น string ตัวเลข", () => {
        expect(locationWord(11)).toBe("11");
        expect(locationWord(99)).toBe("99");
    });
});

describe("formatDate", () => {
    it("คืน empty string เมื่อไม่มีค่า", () => {
        expect(formatDate("")).toBe("");
        expect(formatDate(null)).toBe("");
        expect(formatDate(undefined)).toBe("");
    });

    it("คืนค่าเดิมเมื่อไม่ใช่ ISO date", () => {
        expect(formatDate("not a date")).toBe("not a date");
    });

    it("ฟอร์แมต ISO date เป็น en-GB", () => {
        expect(formatDate("2025-01-15")).toBe("15 Jan 2025");
        expect(formatDate("2025-12-31")).toBe("31 Dec 2025");
    });
});
