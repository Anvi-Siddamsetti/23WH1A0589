const express = require('express');
const router = express.Router();
const userRequestTimestamps = new Map();

router.post('/send', async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ success: false, error: "Missing required fields: userId and message" });
    }

    const currentTime = Date.now();
    const tenSecondsAgo = currentTime - 10000; 

    if (!userRequestTimestamps.has(userId)) {
        userRequestTimestamps.set(userId, []);
    }
    let timestamps = userRequestTimestamps.get(userId);
    timestamps = timestamps.filter(t => t > tenSecondsAgo);
    if (timestamps.length >= 3) {
        return res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Maximum 3 notifications per 10 seconds allowed."
        });
    }

    timestamps.push(currentTime);
    userRequestTimestamps.set(userId, timestamps);

    return res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        rateLimitStatus: `${timestamps.length}/3 messages used in current window`
    });
});

module.exports = router;