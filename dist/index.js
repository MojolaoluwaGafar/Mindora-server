"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const DB_1 = __importDefault(require("./config/DB"));
const chat_1 = __importDefault(require("./routes/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Mindora Server running..." });
});
app.use("/api", chat_1.default);
const startServer = async () => {
    try {
        (0, DB_1.default)();
        console.log("DB Connected");
        console.log("starting server");
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Mindora Server is running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Startup error", error);
    }
};
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.stack || err);
});
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.stack || err);
});
startServer();
// app.use((req : Request, res : Response) => {
//   res.status(404).json({ success: false, message: "ROUTE NOT FOUND" });
// });
