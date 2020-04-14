const main = require("./rateLimiter");

let outputData = "";
storeLog = (inputs) => (outputData += inputs);
test("basic console log test case for rateLimiter", () => {
  console["log"] = jest.fn(storeLog);
  let input = [
    3,
    "A 8",
    "B 6",
    "C 4",
    "D 6",
    "E 2",
    "F 5",
    "G 4",
    "H 5",
    "I 8",
  ];
  const expectedOutput = [""];
  main(input);
  expect(outputData).toBe("START ASTART BSTART C");
});
