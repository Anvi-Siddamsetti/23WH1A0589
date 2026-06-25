const express = require('express');
const schedulerRouter = require('./vehicleScheduler');

const app = express();
app.use(express.json());

app.use('/api', schedulerRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Vehicle Maintenance Scheduler running on http://localhost:${PORT}`);
});