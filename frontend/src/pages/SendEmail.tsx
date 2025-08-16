import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { API_BASE_URL } from "../utils/api";

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
  const { toast } = useToast();

  const company = searchParams.get("company") || "";

  const [people, setPeople] = useState<CampaignPerson[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<
    Record<string, string>
  >({});
  const [loadingEmails, setLoadingEmails] = useState<Record<string, boolean>>(
    {}
  );
  const [prompt, setPrompt] = useState(
    "Write a short cold email introducing our product to this person. Keep it professional and friendly. Their name is [NAME] and they work at [COMPANY]."
  );
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/campaigns/prospects`);
        const data = await res.json();
        const filtered = data.filter(
          (p: CampaignPerson) => p.organization_name === company
        );
        setPeople(filtered);
      } catch (err: any) {
        toast({
          title: "❌ Failed to load prospects",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [company, toast]);

  const toggleSelect = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const generateEmail = async (person: CampaignPerson) => {
    const personPrompt = prompt
      .replace(/\[NAME\]/g, person.name || "there")
      .replace(/\[COMPANY\]/g, person.organization_name || "your company");

    setLoadingEmails((prev) => ({ ...prev, [person.email]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/generate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: personPrompt,
          model: "mistralai/mistral-7b-instruct",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const content = data.content || "No content generated.";
      setGeneratedEmails((prev) => ({ ...prev, [person.email]: content }));
    } catch (err: any) {
      toast({
        title: "❌ Error generating email",
        description: err.message,
        variant: "destructive",
      });
      setGeneratedEmails((prev) => ({
        ...prev,
        [person.email]: "❌ Error generating email",
      }));
    } finally {
      setLoadingEmails((prev) => ({ ...prev, [person.email]: false }));
    }
  };

  const generateAllEmails = async () => {
    const selectedPeople = people.filter((p) =>
      selectedEmails.includes(p.email)
    );
    setGenerating(true);
    await Promise.all(
      selectedPeople.map(async (person) => {
        if (!generatedEmails[person.email]) {
          await generateEmail(person);
        }
      })
    );
    setGenerating(false);
  };

  const sendEmails = async () => {
    // Ensure all emails are generated before sending
    await generateAllEmails();

    const recipients = people
      .filter((p) => selectedEmails.includes(p.email))
      .map((p) => ({
        company: p.organization_name,
        email: p.email,
        linkedin_url: p.linkedin_url,
        message: generatedEmails[p.email] || "",
      }));

    if (recipients.length === 0) {
      toast({
        title: "⚠️ No recipients selected",
        description: "Please select at least one prospect.",
      });
      return;
    }

    try {
      setSending(true);
      const res = await fetch(`${API_BASE_URL}/api/send-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      toast({
        title: "✅ Emails sent successfully!",
        description: `${recipients.length} emails were delivered.`,
      });

      navigate("/prospects");
    } catch (err: any) {
      toast({
        title: "❌ Failed to send emails",
        description: err.message,
        variant: "destructive",
      });
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
              <CardTitle>
                Prospects ({selectedEmails.length}/{people.length} selected)
              </CardTitle>
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
                      disabled={loadingEmails[person.email]}
                    >
                      {generatedEmails[person.email]
                        ? "Regenerate"
                        : "Generate Email"}
                    </Button>

                    {loadingEmails[person.email] && (
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
            disabled={selectedEmails.length === 0 || sending}
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
