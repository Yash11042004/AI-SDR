"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/import.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const XLSX = __importStar(require("xlsx"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        const prospects = json
            .map((row) => ({
            name: row["Name"]?.trim() || "",
            email: row["Email"]?.trim() || "",
            title: row["Title"]?.trim() || "",
            linkedin_url: row["Person Linkedin Url"]?.trim() || "",
            organization_name: row["Company"]?.trim() || "",
        }))
            .filter((p) => p.name !== "" && p.email !== "" && p.organization_name !== "");
        if (prospects.length === 0) {
            return res.status(400).json({ error: "No valid data to import." });
        }
        let campaign = await Campaign_1.default.findOne({ name: "Imported Prospects" });
        if (!campaign) {
            campaign = new Campaign_1.default({
                name: "Imported Prospects",
                campaignPeople: prospects,
                campaignContacts: [],
            });
        }
        else {
            campaign.campaignPeople.push(...prospects);
        }
        await campaign.save();
        res.status(200).json({
            message: "Upload successful",
            importedCount: prospects.length,
            campaignId: campaign._id,
            data: prospects,
        });
    }
    catch (err) {
        console.error("❌ Upload error:", err);
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
