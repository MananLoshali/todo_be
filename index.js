import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import todoRoute from "./Routes/todo.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

dotenv.config({ path: ".env" });
app.use(cors());

connectDB();

app.get("/",(req,res)=>{
	res.send("HEllo");
})

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/todo", todoRoute);

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
