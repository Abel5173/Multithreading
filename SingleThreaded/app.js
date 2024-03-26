// Single Threaded application

const axios = require('axios');
const mongoose = require('mongoose');

const mongURI = 'mongodb://localhost:27017/multi_threaded';

const processedDataSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
})

const ProcessedData = mongoose.model('ProcessedData', processedDataSchema);

async function fetchProcessStoreData() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const rawData = response.data;

        const processedData = rawData.map(data => {
            return {
                name: data.name,
                age: data.username.length,
                email: data.email
            }
        });

        await mongoose.connect(mongURI);

        await ProcessedData.insertMany(processedData);

    } catch (err) {
        console.log(err);
    } finally {
        mongoose.connection.close();
    }
}

const startTime = new Date();
fetchProcessStoreData().then(() => {
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Total Execution time: ${executionTime}ms`);
})