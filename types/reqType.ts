import type { IChatSession } from "../models/ChatSession";
export interface SessionRequest extends Request {
  session?: IChatSession;
}