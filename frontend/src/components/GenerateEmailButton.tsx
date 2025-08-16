import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

interface Props {
  name: string;
  email: string;
  company: string;
  linkedin?: string;
}

export default function GenerateEmailButton({
  name,
  email,
  company,
  linkedin,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate-email`,
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a helpful SDR writing personalized emails.",
            },
            {
              role: "user",
              content: `Write a short outreach email to ${name} (${email}) at ${company}. Their LinkedIn: ${
                linkedin || "N/A"
              }.`,
            },
          ],
        }
      );

      const message = res.data?.choices?.[0]?.message?.content;
      setGeneratedEmail(message || "No email content generated.");
    } catch (err) {
      console.error("❌ Failed to generate email:", err);
      setGeneratedEmail("Error generating email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Email"}
      </Button>
      {generatedEmail && (
        <div className="bg-muted p-2 text-sm rounded max-w-md whitespace-pre-line">
          {generatedEmail}
        </div>
      )}
    </div>
  );
}
