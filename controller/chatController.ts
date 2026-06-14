import { Request, Response } from "express"
import { sendToAI } from "../Services/ai"
import Flagged from "../models/Flagged";
import { getUnsafeReason } from "../utils/unsafe";
import { isEmergency } from "../utils/emergency";

export const sendMessage = async (req: Request, res: Response) => {
    // console.log("SEND MESSAGE HIT");
    // console.log("SESSION:", (req as any).session);

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: true,
        message: "Message is required",
      });
    }

    const session = (req as any).session;
    if (!session) {
      return res.status(500).json({
        success: false,
        message: "Session not attached to request",
      });
    }

    const unsafeReason = getUnsafeReason(message);
    const emergency = isEmergency(message);
    
    if (emergency) {
      await Flagged.create({
        sessionId: session.sessionId,
        message,
        reason: "Emergency Self-Harm Risk",
      });
      // console.log("emergency text from user :",emergency);
      
      const emergencyReply = "It sounds like you may be going through something very serious right now. Please reach out to a trusted adult, family member, local emergency service, or mental health professional immediately.";
      
      session.messages.push({
        sender: "user",
        text: message,
      });
      
      session.messages.push({
        sender: "ai",
        text: emergencyReply,
      });
      
      await session.save();
      
      return res.status(200).json({
        reply: emergencyReply,
        history: session.messages,
      });
    }
    else if (unsafeReason) {
      await Flagged.create({
        sessionId: session.sessionId,
        message,
        reason: unsafeReason,
      });
    }

    const reply = await sendToAI(message);

    session.messages.push({
      sender: "user",
      text: message,
    });

    session.messages.push({
      sender: "ai",
      text: reply,
    });

    await session.save();

    return res.json({
      reply,
      history: session.messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "AI integration failed",
    });
  }
};