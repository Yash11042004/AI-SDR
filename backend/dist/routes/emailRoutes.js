"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { prompt, model } = req.body;
        const referer = process.env.NODE_ENV === "production"
            ? "https://aisdr.zicloud.co"
            : "http://localhost:8080";
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": referer,
                "X-Title": "AI SDR Campaign Email",
            },
            body: JSON.stringify({
                model: model || "mistralai/mistral-7b-instruct",
                messages: [
                    { role: "system", content: "You are an expert cold email writer." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
            }),
        });
        if (!aiRes.ok) {
            const errText = await aiRes.text();
            throw new Error(`OpenRouter error: ${errText}`);
        }
        const data = await aiRes.json();
        console.log("OpenRouter raw response:", JSON.stringify(data, null, 2));
        res.json({
            content: data.choices?.[0]?.message?.content || "No content generated.",
        });
    }
    catch (err) {
        console.error("❌ Error generating email:", err);
        res.status(500).json({ error: err.message || "Failed to generate email" });
    }
});
exports.default = router;
