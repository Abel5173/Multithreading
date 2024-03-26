const { workerData, parentPort } = require("worker_threads");
const mongoose = require("mongoose");

const processedDataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const ProcessedData = mongoose.model("ProcessedData", processedDataSchema);

mongoose.connect("mongodb://localhost:27017/single_threaded");

const saveData = async () => {
  const { processedData, startTime } = workerData;
  try {
    const processedDataDoc = new ProcessedData(processedData);
    await processedDataDoc.save();
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Total Execution time: ${executionTime}ms`);
  } catch (err) {
    console.error("Error saving data:", err);
  } finally {
    mongoose.disconnect();
  }
};

saveData();
