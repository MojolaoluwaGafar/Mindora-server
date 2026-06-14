import { Request, Response, NextFunction } from "express";
import ChatSession from "../models/ChatSession";

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("VERIFY SESSION HIT");
  // console.log("Headers:", req.headers);
  try {
    const sessionId = req.headers["x-session-id"] as string;

    // console.log("Session ID:", sessionId);

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Session ID missing",
      });
    }

    let session = await ChatSession.findOne({ sessionId });

    if (!session) {
      session = await ChatSession.create({
        sessionId,
        messages: [],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
    }

    session.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await session.save();

    (req as any).session = session;

    // console.log("Passing to controller");
    
    next();
  } catch (err) {
    console.error("Session verification error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error verifying session",
    });
  }
};