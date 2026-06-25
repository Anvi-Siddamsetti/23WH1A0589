const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_URL = 'http://4.224.186.213/evaluation-service';


function solveKnapsack(tasks, budget) {
    const n = tasks.length;
    
    const dp = Array.from({ length: n + 1 }, () => Array(budget + 1).fill(0));

    
    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = tasks[i - 1];
        for (let w = 0; w <= budget; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - Duration] + Impact);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    
    const selectedTasks = [];
    let w = budget;
    for (let i = n; i > 0; i--) {
        
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedTasks.push(tasks[i - 1].TaskID);
            w -= tasks[i - 1].Duration;
        }
    }

    return {
        totalImpact: dp[n][budget],
        allocatedHours: budget - w,
        selectedTasks: selectedTasks.reverse() 
    };
}


router.get('/schedule', async (req, res) => {
    try {
        
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is required' });
        }

        const axiosConfig = {
            headers: { 'Authorization': authHeader }
        };

        
        const [depotsResponse, vehiclesResponse] = await Promise.all([
            axios.get(`${BASE_URL}/depots`, axiosConfig),
            axios.get(`${BASE_URL}/vehicles`, axiosConfig)
        ]);

        const depots = depotsResponse.data.depots;
        const tasks = vehiclesResponse.data.vehicles;

    
        const optimizationResults = depots.map(depot => {
            const knapsackResult = solveKnapsack(tasks, depot.MechanicHours);
            return {
                depotID: depot.ID,
                mechanicHourBudget: depot.MechanicHours,
                ...knapsackResult
            };
        });

        
        return res.json({
            success: true,
            schedules: optimizationResults
        });

    } catch (error) {
        console.error('Error vehicle maintenance schedules:', error.message);
        return res.status(error.response?.status || 500).json({
            error: 'Failed to process ',
            details: error.response?.data || error.message
        });
    }
});
module.exports = router;
