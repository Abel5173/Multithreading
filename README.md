# Multithreading vs. Single Threading in Node.js

In Node.js, multithreading and single threading are two different approaches to handle concurrent tasks. Multithreading involves running multiple threads simultaneously, whereas single threading executes tasks sequentially within a single thread.

## Multithreading Implementation

### app.js (Multithreading)

```javascript
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
```

### dataProcessingWorker.js (Multithreading)

```javascript
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
```

### dataStorageWorker.js (Multithreading)

```javascript
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
```

### Execution Time (Multithreading)

#### <b><i>Execution Time: 2000ms</i></b>

## Single Threading Implementation

### app.js (Single Threading)

```javascript
async function fetchProcessStoreData() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const rawData = response.data;

    const processedData = rawData.map((data) => {
      return {
        name: data.name,
        age: data.username.length,
        email: data.email,
      };
    });

    await mongoose.connect(mongURI);

    await ProcessedData.insertMany(processedData);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}
```

### Execution Time (Single Threading)

#### <b><i>Execution Time: 4000ms</i></b>
<br></br>

# Conclusion

> **Multithreading** allows tasks to be executed concurrently, which can lead to improved performance and reduced execution time, especially for CPU-bound tasks. However, implementing multithreading adds complexity to the codebase.

> On the other hand, **single threading** simplifies the codebase by executing tasks sequentially within a single thread. While this approach is easier to manage, it may lead to longer execution times for CPU-bound tasks. 

In the provided implementations, the **multithreading approach significantly reduces the execution time** compared to the single threading approach, showcasing the benefits of parallel execution. :rocket:

**