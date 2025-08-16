"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const referer = process.env.NODE_ENV === "production"
            ? "https://aisdr.zicloud.co"
            : "http://localhost:8080";
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": referer,
                "X-Title": "AI SDR Campaign",
            },
            body: JSON.stringify(req.body),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter error: ${errorText}`);
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error("❌ Error calling OpenRouter:", error);
        res
            .status(500)
            .json({ error: error.message || "OpenRouter request failed" });
    }
});
exports.default = router;
