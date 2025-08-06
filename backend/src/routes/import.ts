// routes/import.ts
import express from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import Campaign from "../models/Campaign";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const prospects = (json as any[])
      .map((row) => ({
        name: row["Name"]?.trim() || "",
        email: row["Email"]?.trim() || "",
        title: row["Title"]?.trim() || "",
        linkedin_url: row["Person Linkedin Url"]?.trim() || "",
        organization_name: row["Company"]?.trim() || "",
      }))
      .filter(
        (p) => p.name !== "" && p.email !== "" && p.organization_name !== ""
      );

    if (prospects.length === 0) {
      return res.status(400).json({ error: "No valid data to import." });
    }

    let campaign = await Campaign.findOne({ name: "Imported Prospects" });

    if (!campaign) {
      campaign = new Campaign({
        name: "Imported Prospects",
        campaignPeople: prospects,
        campaignContacts: [],
      });
    } else {
      campaign.campaignPeople.push(...prospects);
    }

    await campaign.save();

    res.status(200).json({
      message: "Upload successful",
      importedCount: prospects.length,
      campaignId: campaign._id,
      data: prospects,
    });
  } catch (err: any) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
