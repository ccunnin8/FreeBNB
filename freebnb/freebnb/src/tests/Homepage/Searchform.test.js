import React from "react";
import SearchForm, { parseDate } from "../../components/SearchForm"
import { render } from "@testing-library/react";

describe("search from should work correctly", () => {
    it("should be able to parse dates correctly - no date given", () => {
        expect(parseDate("")).toBe("");
        expect(parseDate()).toBe("");
    });

    it("should be able to parse dates correctly - correct date given", () => {
        const myBday = "1988-3-14";
        const date = parseDate(myBday);
        expect(date).toBe("03/14/1988")
        const testDate = "2020-10-20"
        expect(parseDate(testDate)).toBe("10/20/2020")
        const testDate1 = "2020-01-01"
        expect(parseDate(testDate1)).toBe("01/01/2020")
    });
});