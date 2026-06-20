"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToAI = sendToAI;
const axios_1 = __importDefault(require("axios"));
const fetchModels_1 = require("./fetchModels");
async function sendToAI(message) {
    try {
        // console.log("Groq model:", process.env.GROQ_MODEL);
        // console.log("Groq key present:", !!process.env.GROQ_API_KEY);
        const model = (0, fetchModels_1.pickModel)(process.env.GROQ_MODEL || "llama-3.3-70b-versatile");
        const response = await axios_1.default.post("https://api.groq.com/openai/v1/chat/completions", {
            model,
            messages: [{ role: "user", content: message }],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.choices[0].message.content;
    }
    catch (groqError) {
        console.error("Groq error, falling back to Claude:", groqError.response?.data || groqError.message);
        try {
            const response = await axios_1.default.post("https://api.anthropic.com/v1/messages", {
                model: "claude-3-opus-20240229",
                max_tokens: 300,
                messages: [{ role: "user", content: message }],
            }, {
                headers: {
                    "x-api-key": process.env.CLAUDE_API_KEY,
                    "Content-Type": "application/json",
                },
            });
            return response.data.content[0].text;
        }
        catch (claudeError) {
            console.error("Claude error:", claudeError.response?.data || claudeError.message);
            throw new Error("AI integration failed (Groq and Claude both unavailable)");
        }
    }
}
