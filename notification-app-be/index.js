const express = require('express');
const notificationRouter = require('./notificationRouter');

const app = express();
const PORT = 5001; 
app.use(express.json());
app.use('/api/notifications', notificationRouter);

app.listen(PORT, () => {
    console.log(`Notification Engine microservice running safely on port ${PORT}`);
});