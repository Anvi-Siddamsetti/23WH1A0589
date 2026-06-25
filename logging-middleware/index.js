const express = require('express');
const app = express();
const PORT = 5002; 

app.use(express.json());


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip;

    console.log(`[${timestamp}] ${method} request made to ${url} from IP: ${ip}`);
    
    next(); 
});

app.get('/api/test', (req, res) => {
    res.status(200).json({ success: true, message: "Logging middleware verified!" });
});

app.post('/api/data', (req, res) => {
    res.status(200).json({ success: true, message: "Data received and logged successfully." });
});

app.listen(PORT, () => {
    console.log(`Logging Middleware microservice running safely on port ${PORT}`);
});