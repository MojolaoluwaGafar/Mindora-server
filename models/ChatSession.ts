import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  sender: "user" | "ai";
  text: string;
}

export interface IChatSession extends Document {
  sessionId: string;
  messages: IMessage[];
  expiresAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
});

const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: { type: String, required: true, unique: true },
  messages: [MessageSchema],
  expiresAt: { type: Date, default: () => new Date(Date.now() + 60 * 60 * 1000) },
});

ChatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
