## 🚀 Multithreading vs. Single Threading in Node.js 🚀

In the world of Node.js, we have two powerful warriors to handle concurrent tasks - **Multithreading** and **Single Threading**. 

🔥 **Multithreading** charges ahead, running multiple threads in parallel, maximizing efficiency and performance.

🌊 **Single Threading**, on the other hand, takes a calm and sequential approach, executing tasks one after the other within a single thread.

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

### :stopwatch: Execution Time (Single Threading)

> #### :alarm_clock: <b><i>Execution Time: 2000ms</i></b>
> #### :hourglass_flowing_sand: This is significantly longer than the multithreaded execution time.

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

### :stopwatch: Execution Time (Single Threading)

> #### :alarm_clock: <b><i>Execution Time: 4000ms</i></b>
> #### :hourglass_flowing_sand: This is significantly longer than the multithreaded execution time.


# :trophy: Conclusion

> :zap: **Multithreading** is a powerful tool that allows tasks to be executed concurrently. This can supercharge performance and slash execution time, particularly for CPU-bound tasks. However, with great power comes great responsibility - implementing multithreading can add complexity to your codebase.

> :snail: On the flip side, **single threading** keeps things simple by executing tasks one after the other within a single thread. This approach is easier to manage, but beware - it may lead to longer execution times for CPU-bound tasks. 

In the examples provided, the **multithreading approach dramatically cuts down the execution time** compared to the single threading approach. This clearly demonstrates the power of parallel execution. :rocket:
