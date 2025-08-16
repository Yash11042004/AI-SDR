"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/groqRoutes.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        if (!groqResponse.ok) {
            const errText = await groqResponse.text();
            throw new Error(errText);
        }
        const data = await groqResponse.json();
        res.json(data);
    }
    catch (err) {
        console.error("Groq API error:", err);
        res.status(500).json({ error: "Failed to call Groq API" });
    }
});
exports.default = router;
