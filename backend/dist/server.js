"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const import_1 = __importDefault(require("./routes/import"));
const openai_1 = __importDefault(require("./routes/openai"));
const openRouterRoutes_1 = __importDefault(require("./routes/openRouterRoutes"));
const groqRoutes_1 = __importDefault(require("./routes/groqRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const mongoURI = process.env.MONGO_URI || "";
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
app.use("/api/campaigns", campaignRoutes_1.default);
app.use("/api/import", import_1.default);
app.use("/api/openai", openai_1.default);
app.use("/api/openrouter", openRouterRoutes_1.default);
app.use("/api/groq-chat", groqRoutes_1.default);
app.use("/api/generate-email", emailRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
