// dataProcessingWorker.js

const { workerData, parentPort } = require("worker_threads");

// Data processing logic
function processData(data) {
  return {
    name: data.name,
    age: data.username.length,
    email: data.email,
  };
}

// Process the data
const processedData = processData(workerData);

// Send the processed data to the parent thread
parentPort.postMessage(processedData);
