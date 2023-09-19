import express from "express";
const app = express();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errormiddleware.js";
dotenv.config();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());
connectDB();

//Routes
app.use("/api", userRoutes);

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
