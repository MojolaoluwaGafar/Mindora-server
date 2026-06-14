import express, { Router } from "express";
import { sendMessage } from "../controller/chatController";
import { verifySession } from "../middlewares/verifySession";

// console.log("Chat routes loaded");
const router : Router = express.Router();
router.post("/aiChat", verifySession, sendMessage);

export default router;