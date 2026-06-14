"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controller/chatController");
const verifySession_1 = require("../middlewares/verifySession");
console.log("Chat routes loaded");
const router = express_1.default.Router();
router.post("/aiChat", verifySession_1.verifySession, chatController_1.sendMessage);
exports.default = router;
