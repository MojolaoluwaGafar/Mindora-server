"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = void 0;
const ChatSession_1 = __importDefault(require("../models/ChatSession"));
const verifySession = async (req, res, next) => {
    try {
        const sessionId = req.headers["x-session-id"];
        if (!sessionId) {
            return res.status(401).json({ success: false, message: "Session ID missing" });
        }
        const session = await ChatSession_1.default.findOne({ sessionId });
        if (!session) {
            return res.status(401).json({ success: false, message: "Invalid or expired session" });
        }
        req.session = session;
        next();
    }
    catch (err) {
        console.error("Session verification error:", err);
        res.status(500).json({ success: false, message: "Server error verifying session" });
    }
};
exports.verifySession = verifySession;
