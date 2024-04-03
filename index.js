import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./DataBase/DbConfig.js";
import userRouter from "./Routers/userRoutes.js";
import foodsRouter from "./Routers/foodsRouter.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://diet-suggestion-app-frontend.netlify.app/",
  })
);
app.use(express.json());
const port = process.env.PORT || 3000;
connectDB();

app.use("/api/user", userRouter);
app.use("/api", foodsRouter);

app.listen(port, () => {
  console.log("Server is running at port", port);
});
