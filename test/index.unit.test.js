import { hello } from "../src";

describe("hello", function() {
	it("should return correct text", async () => {
		const word = "world"
		const res = hello(word)
		expect(res).toBe("hello world")
	});
});
