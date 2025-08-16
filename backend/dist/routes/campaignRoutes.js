"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Campaign_1 = __importDefault(require("../models/Campaign"));
const router = (0, express_1.Router)();
// POST /api/campaigns → Save new campaign
router.post("/", async (req, res) => {
    try {
        const body = Array.isArray(req.body) ? req.body[0] : req.body;
        if (!body || typeof body !== "object") {
            return res
                .status(400)
                .json({ error: "Request body must be a valid object" });
        }
        const { campaignPeople, campaignContacts } = body;
        if (!campaignPeople || !campaignContacts) {
            return res.status(400).json({ error: "Missing campaign data" });
        }
        const newCampaign = new Campaign_1.default({ campaignPeople, campaignContacts });
        await newCampaign.save();
        res.status(201).json(newCampaign);
    }
    catch (error) {
        console.error("❌ Error saving campaign:", error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/campaigns → All campaigns
router.get("/", async (_req, res) => {
    try {
        const campaigns = await Campaign_1.default.find();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/campaigns/latest → Most recent campaign
router.get("/latest", async (_req, res) => {
    try {
        const campaign = await Campaign_1.default.findOne().sort({ createdAt: -1 });
        if (!campaign)
            return res.status(404).json({ error: "No campaign found" });
        res.json(campaign);
    }
    catch (error) {
        console.error("❌ Error fetching latest campaign:", error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/campaigns/top → Top 3 people from latest campaign
router.get("/top", async (_req, res) => {
    try {
        const latestCampaign = await Campaign_1.default.findOne().sort({ createdAt: -1 });
        if (!latestCampaign) {
            return res.status(404).json({ error: "No campaign found" });
        }
        const top3 = latestCampaign.campaignPeople.slice(0, 3);
        res.json(top3);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/campaigns/prospects → All prospects, sorted by recent campaigns
router.get("/prospects", async (_req, res) => {
    try {
        const campaigns = await Campaign_1.default.find().sort({ createdAt: -1 }).lean();
        const allProspects = campaigns.flatMap((campaign) => campaign.campaignPeople || []);
        res.json(allProspects);
    }
    catch (error) {
        console.error("❌ Error fetching all prospects:", error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/campaigns/unique-companies?limit=3 → 1 person per unique company
router.get("/unique-companies", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const campaign = await Campaign_1.default.findOne().sort({ createdAt: -1 }).lean();
        if (!campaign)
            return res.status(404).json({ error: "No campaign found" });
        const companyMap = new Map();
        for (const person of campaign.campaignPeople) {
            const org = person.organization_name;
            if (org && !companyMap.has(org)) {
                companyMap.set(org, person); // Keep first representative for each company
            }
        }
        const companies = Array.from(companyMap.values());
        const result = limit > 0 ? companies.slice(0, limit) : companies;
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error fetching companies:", err);
        res.status(500).json({ error: err.message });
    }
});
// /api/campaigns/analytics → Returns real-time stats
router.get("/analytics", async (_req, res) => {
    try {
        const campaigns = await Campaign_1.default.find().sort({ createdAt: -1 }).lean();
        const allProspects = campaigns.flatMap((c) => c.campaignPeople || []);
        const totalProspects = allProspects.length;
        const uniqueCompanies = new Set(allProspects.map((p) => p.organization_name)).size;
        // Mock values for now (unless you track them)
        const emailsSentToday = 1423;
        const responseRate = 0.235; // 23.5%
        const meetingsScheduled = 47;
        res.json({
            totalProspects,
            uniqueCompanies,
            emailsSentToday,
            responseRate,
            meetingsScheduled,
        });
    }
    catch (err) {
        console.error("❌ Error fetching analytics:", err);
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
