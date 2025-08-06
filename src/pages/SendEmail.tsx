import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

type CampaignPerson = {
  name: string;
  title: string;
  email: string;
  organization_name: string;
  linkedin_url: string;
};

export default function SendEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const company = searchParams.get("company") || "";

  const [people, setPeople] = useState<CampaignPerson[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<
    Record<string, string>
  >({});
  const [prompt, setPrompt] = useState(
    "Write a short cold email introducing our product to this person. Keep it professional and friendly. Their name is [NAME] and they work at [COMPANY]."
  );
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/campaigns/prospects"
        );
        const data = await res.json();
        const filtered = data.filter(
          (p: CampaignPerson) => p.organization_name === company
        );
        setPeople(filtered);
      } catch (err) {
        console.error("Error fetching prospects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [company]);

  const toggleSelect = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const generateEmail = async (person: CampaignPerson) => {
    const personPrompt = prompt
      .replace(/\[NAME\]/g, person.name)
      .replace(/\[COMPANY\]/g, person.organization_name);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080",
          "X-Title": "AI SDR Campaign",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: "You are a B2B email writing expert." },
            { role: "user", content: personPrompt },
          ],
        }),
      });

      const data = await res.json();
      const content =
        data.choices?.[0]?.message?.content || "No content generated.";
      setGeneratedEmails((prev) => ({ ...prev, [person.email]: content }));
    } catch (err) {
      console.error("Error generating email:", err);
      setGeneratedEmails((prev) => ({
        ...prev,
        [person.email]: "❌ Error generating email",
      }));
    }
  };

  const generateAllEmails = async () => {
    const selectedPeople = people.filter((p) =>
      selectedEmails.includes(p.email)
    );

    setGenerating(true);
    for (const person of selectedPeople) {
      if (!generatedEmails[person.email]) {
        await generateEmail(person);
      }
    }
    setGenerating(false);
  };

  const sendEmails = async () => {
    const recipients = people
      .filter((p) => selectedEmails.includes(p.email))
      .map((p) => ({
        company: p.organization_name,
        email: p.email,
        linkedin_url: p.linkedin_url,
        message: generatedEmails[p.email] || "",
      }));

    if (recipients.length === 0) {
      alert("No recipients selected");
      return;
    }

    try {
      setSending(true);
      const res = await fetch(
        "http://localhost:5678/webhook-test/send-emails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipients }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      alert("✅ Emails sent successfully!");
      navigate("/prospects");
    } catch (err) {
      console.error("Send email error", err);
      alert("❌ Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Email to Prospects at {company}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt. Use [NAME] and [COMPANY] as placeholders."
            />
          </CardContent>
        </Card>

        {loading ? (
          <p>Loading prospects...</p>
        ) : people.length === 0 ? (
          <p>No prospects found for this company.</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Prospects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {people.map((person) => (
                <div
                  key={person.email}
                  className="border rounded-md p-4 flex flex-col gap-2 bg-secondary/40"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.title} • {person.email}
                      </p>
                    </div>
                    <Checkbox
                      checked={selectedEmails.includes(person.email)}
                      onCheckedChange={() => toggleSelect(person.email)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateEmail(person)}
                      disabled={generating}
                    >
                      {generatedEmails[person.email]
                        ? "Regenerate"
                        : "Generate Email"}
                    </Button>

                    {generating && !generatedEmails[person.email] && (
                      <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {generatedEmails[person.email] && (
                    <pre className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
                      {generatedEmails[person.email]}
                    </pre>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-4 mt-4 items-center">
          <Button
            className="bg-primary text-white"
            disabled={
              selectedEmails.length === 0 ||
              sending ||
              !selectedEmails.every((email) => generatedEmails[email])
            }
            onClick={sendEmails}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Email to Selected"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={generateAllEmails}
            disabled={selectedEmails.length === 0 || generating}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate All Emails"
            )}
          </Button>

          <Button variant="secondary" onClick={() => navigate("/prospects")}>
            ← Back
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
