import express, { Application,Request, Response} from "express"
import dotenv from 'dotenv'
import cors from "cors"
import connectDB from "./config/DB"
import chatRouter from "./routes/chat"
import { initGroqModels } from "./Services/fetchModels"
dotenv.config()


const app : Application = express()


app.use(express.json());
// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "https://mindora-client-two.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS Origin:", origin);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-session-id",
    ],
  })
);

app.get("/", (req : Request , res : Response)=>{  
    res.status(200).json({ success : true, message : "Mindora Server running..."})
})
app.use("/api", chatRouter);

const startServer = async () => {
    try {
        connectDB();
        initGroqModels();
        // console.log("starting server");
        const PORT : string | undefined = process.env.PORT
        app.listen(PORT, ()=>{
            // console.log(`Mindora Server is running at http://localhost:${PORT}`);
            
        })
    } catch (error) {
        console.error("Startup error",error);
    }
}
process.on("uncaughtException", (err : any) => {
  console.error("Uncaught Exception:", err.stack || err);
});
process.on("unhandledRejection", (err : any) => {
  console.error("Unhandled Rejection:", err.stack || err);
});
startServer()

app.use((req : Request, res : Response) => {
  res.status(404).json({ success: false, message: "ROUTE NOT FOUND" });
});
