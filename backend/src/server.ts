import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import campaignRoutes from "./routes/campaignRoutes";
import importRoutes from "./routes/import";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
