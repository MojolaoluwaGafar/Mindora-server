import express, { Application,Request, Response} from "express"
import dotenv from 'dotenv'
import cors from "cors"
import connectDB from "./config/DB"
import chatRouter from "./routes/chat"

dotenv.config()
const app : Application = express()


const allowedOrigins = new Set([
    "https://mindora-client-two.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
])
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json())


app.options("*", cors());
app.get("/", (req : Request , res : Response)=>{  
    res.status(200).json({ success : true, message : "Mindora Server running..."})
})
app.use("/api", chatRouter);

const startServer = async () => {
    try {
        connectDB()
    
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
