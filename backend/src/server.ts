import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import campaignRoutes from "./routes/campaignRoutes";
import importRoutes from "./routes/import";
import openaiRoutes from "./routes/openai";
import openRouterRoutes from "./routes/openRouterRoutes";
import groqRoutes from "./routes/groqRoutes";
import emailRoutes from "./routes/emailRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || "";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/campaigns", campaignRoutes);
app.use("/api/import", importRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/openrouter", openRouterRoutes);
app.use("/api/groq-chat", groqRoutes);
app.use("/api/generate-email", emailRoutes);
// this is just a comment for show

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
