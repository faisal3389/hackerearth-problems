const main = require("./rateLimiter");

let outputData = "";
storeLog = (inputs) => (outputData += inputs);
test("basic console log test case for rateLimiter", async () => {
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
  await main(input);
  expect(outputData).toBe(
    "START A,\
START B,\
START C,\
START D,\
FINISH C,\
START E,\
FINISH B,\
START F,\
FINISH A,\
START G,\
FINISH E,\
START H,\
FINISH D,\
START I,\
FINISH G,\
FINISH F,\
FINISH H,\
FINISH I,"
  );
});
