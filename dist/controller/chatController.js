"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const ai_1 = require("../Services/ai");
const ChatSession_1 = __importDefault(require("../models/ChatSession"));
const sendMessage = async (Req, Res) => {
    console.log("sending message");
    const sessionId = Req.headers["sessionid-xoxo"];
    console.log("Headers received:", sessionId);
    const { message } = Req.body;
    if (!message) {
        return Res.status(400).json({
            error: true,
            message: "Message is required"
        });
    }
    if (!sessionId) {
        return Res.status(400).json({
            error: true,
            message: "SessionId is required"
        });
    }
    try {
        let session = await ChatSession_1.default.findOne({ sessionId });
        if (!session) {
            session = new ChatSession_1.default({ sessionId, messages: [] });
        }
        const reply = await (0, ai_1.sendToAI)(message);
        session.messages.push({ sender: "user", text: message });
        session.messages.push({ sender: "ai", text: reply });
        session.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await session.save();
        Res.json({ reply, history: session.messages });
    }
    catch (error) {
        console.error(error);
        Res.status(500).json({
            error: "AI integration failed"
        });
    }
};
exports.sendMessage = sendMessage;
