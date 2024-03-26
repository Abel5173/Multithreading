const { workerData, parentPort } = require("worker_threads");

function processData(data) {
  if (data && Array.isArray(data)) {
    return data.map((item) => ({
      name: item.name,
      age: item.username.length,
      email: item.email,
    }));
  } else {
    console.error("Received invalid data from main thread.");
    return [];
  }
}

const processedData = processData(workerData);
parentPort.postMessage(processedData);
