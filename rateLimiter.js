/* Please ensure that before submitting, you do not have any console logs in your solution.
 */

const getRateLimiter = (apiService, limit) => {
  // Your code here...
  var numberOfAPIsInprogress = 0;
  var promiseResolvesArr = [];
  var pendingRequests = [];
  const resolvePromiseExternally = (requestId, apiService) => {
    numberOfAPIsInprogress++;
    apiService(requestId).then((res) => {
      const pResolve = promiseResolvesArr.find(
        (k) => k.requestId === requestId
      );
      pResolve.resolve(res);
      numberOfAPIsInprogress--;
      if (pendingRequests.length) {
        const firstElement = pendingRequests.shift();
        resolvePromiseExternally(firstElement, apiService);
      }
    });
  };
  const send = (requestId) => {
    // Your code here...
    if (numberOfAPIsInprogress >= limit) {
      const pendingPromise = new Promise((resolve) => {
        promiseResolvesArr.push({ requestId: requestId, resolve: resolve });
        pendingRequests.push(requestId);
      });
      return pendingPromise;
    }
    return new Promise((resolve) => {
      // Your code here...
      numberOfAPIsInprogress++;
      apiService(requestId).then((res) => {
        resolve(res);
        numberOfAPIsInprogress--;
        if (pendingRequests.length) {
          const firstElement = pendingRequests.shift();
          resolvePromiseExternally(firstElement, apiService);
        }
      });
    });
  };

  return { send }; // Do not change the return  type
};

/*
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// Do not change below code or you will be disqualified.
// We suggest you to go through the below code to debug issues.
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
*/

async function main(input) {
  const lines = input;
  const limit = parseInt(lines[0]);
  const requestTuples = lines.slice(1, lines.length).map((tupleStr) => {
    let [id, duration] = tupleStr.split(" ");
    id = id.trim();
    duration = parseInt(duration);
    return { id, duration };
  });

  await runner(limit, requestTuples);
}

const runner = async (limit, requestTuples) => {
  const batchLog = [];

  const apiService = (requestID) => {
    const log = `START ${requestID},`;
    console.log(log);
    return new Promise((resolve, reject) => {
      const info = requestTuples.find((item) => item.id === requestID);
      setTimeout(function () {
        const finishLog = `FINISH ${info.id},`;
        resolve(finishLog);
      }, info.duration * 100);
    });
  };
  const rateLimiter = getRateLimiter(apiService, limit);

  // Runner is going to call send for all API requests at once and in the same order
  // as input testcase
  await Promise.all(
    requestTuples.map((r) => {
      const requestID = r.id;

      // The send function is the one returned from getRateLimiter()
      return rateLimiter
        .send(requestID)
        .then((response) => console.log(response));
    })
  );
};

module.exports = main;

/**
 * // Input parsing
process.stdin.resume();
process.stdin.setEncoding("utf-8");
let stdin_input = "";
process.stdin.on("data", function(input) {
    stdin_input += input; // Reading input from STDIN
});
process.stdin.on("end", function() {
    main(stdin_input);
});
*/

// main([3, "A 8", "B 6", "C 4", "D 6", "E 2", "F 5", "G 4", "H 5", "I 8"]);

/*
test input
3
A 8
B 6
C 4
D 6
E 2
F 5
G 4
H 5
I 8
*/
