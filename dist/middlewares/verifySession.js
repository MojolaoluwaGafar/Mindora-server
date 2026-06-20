"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = void 0;
const ChatSession_1 = __importDefault(require("../models/ChatSession"));
const verifySession = async (req, res, next) => {
    // console.log("VERIFY SESSION HIT");
    // console.log("Headers:", req.headers);
    try {
        const sessionId = req.headers["x-session-id"];
        // console.log("Session ID:", sessionId);
        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Session ID missing",
            });
        }
        let session = await ChatSession_1.default.findOne({ sessionId });
        if (!session) {
            session = await ChatSession_1.default.create({
                sessionId,
                messages: [],
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            });
        }
        session.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await session.save();
        req.session = session;
        // console.log("Passing to controller");
        next();
    }
    catch (err) {
        console.error("Session verification error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error verifying session",
        });
    }
};
exports.verifySession = verifySession;
