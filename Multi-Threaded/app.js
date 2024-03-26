const {
  Worker,
  workerData,
  parentPort,
  isMainThread,
} = require("worker_threads");
const axios = require("axios");
const mongoose = require("mongoose");

async function fetchData() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users",
      { timeout: 5000 }
    ); // Timeout in milliseconds
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

if (isMainThread) {
  const startTime = new Date();
  fetchData()
    .then((data) => {
      const dataProcessingWorker = new Worker("./dataProcessingWorker.js", {
        workerData: data,
      });

      dataProcessingWorker.on("message", (processedData) => {
        const dataStorageWorker = new Worker("./dataStorageWorker.js", {
          workerData: { processedData, startTime },
        });

        dataStorageWorker.on("message", (message) => {});

        dataStorageWorker.on("error", (err) => {
          console.error("Error in data storage worker:", err);
        });
      });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
}
