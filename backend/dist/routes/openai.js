"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/openai.ts
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/parse", async (req, res) => {
    const { input } = req.body;
    try {
        const response = await axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Extract the following fields from the user input related to a campaign prompt: role, department, industry, country, additional. Return ONLY JSON with these keys. If any are missing, leave them blank.",
                },
                { role: "user", content: input },
            ],
            temperature: 0.5,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const content = response.data?.choices?.[0]?.message?.content || "{}";
        let parsed;
        try {
            parsed = JSON.parse(content);
        }
        catch {
            parsed = {
                role: "",
                department: "",
                industry: "",
                country: "",
                additional: "",
            };
        }
        res.json(parsed);
    }
    catch (err) {
        if (err && err.response) {
            console.error("OpenAI API error:", err.response.data || err.message);
        }
        else {
            console.error("Unknown error:", err);
        }
        res.status(500).json({ error: "Failed to parse input" });
    }
});
exports.default = router;
