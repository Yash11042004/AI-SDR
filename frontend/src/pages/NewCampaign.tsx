import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function NewCampaign() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      message:
        "👋 Hi! Tell me about the leads you're looking for (e.g., 'I want Directors from the Tech industry in the US who recently got funding').",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState({
    role: "",
    department: "",
    industry: "",
    country: "",
    additional: "",
  });
  const [loading, setLoading] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // 🔔 Show reminder toast after 3rd bot message if user hasn’t ended
  useEffect(() => {
    const botMessages = chatHistory.filter((m) => m.role === "bot").length;
    if (botMessages === 3 && step === 0) {
      toast({
        title: "💡 Tip",
        description:
          'Type "yes", "done", or "continue" when you are ready to generate the campaign prompt.',
        duration: 6000, // stays visible for 6s
      });
    }
  }, [chatHistory, step, toast]);

  const generateResponse = async (chatHistory: any[]) => {
    try {
      const res = await axios.post(`${API_BASE}/api/groq-chat`, {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for creating B2B lead generation campaigns.

Ask one follow-up question at a time to get:
- Role
- Department
- Industry
- Country
- Additional info

When the user says "done", "continue", or "yes", stop asking questions and summarize into the final campaign prompt.`,
          },
          ...chatHistory.map((msg) => ({
            role: msg.role === "bot" ? "assistant" : msg.role,
            content: msg.message,
          })),
        ],
        temperature: 0.6,
      });

      return res.data?.choices?.[0]?.message?.content?.trim();
    } catch (err: any) {
      console.error("Groq API error:", err.response?.data || err.message);
      return null;
    }
  };

  const updateAnswersFromInput = (input: string) => {
    const lower = input.toLowerCase();
    const updated = { ...answers };

    if (!updated.role && /director|manager|executive|founder/.test(lower)) {
      updated.role = input;
    }
    if (
      !updated.department &&
      /product|sales|marketing|engineering|hr/.test(lower)
    ) {
      updated.department = input;
    }
    if (
      !updated.industry &&
      /tech|fintech|healthtech|ai|e-?commerce/.test(lower)
    ) {
      updated.industry = input;
    }
    if (!updated.country && /(us|united states|india|uk|canada)/.test(lower)) {
      updated.country = input;
    }
    if (
      !updated.additional &&
      /funding|recently raised|growth|expanding/.test(lower)
    ) {
      updated.additional = input;
    }

    return updated;
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newHistory = [...chatHistory, { role: "user", message: userInput }];
    setChatHistory(newHistory);

    const updatedAnswers = updateAnswersFromInput(userInput);

    if (/^(done|continue|yes)$/i.test(userInput.trim())) {
      const summaryPromptRaw = await generateResponse([
        ...newHistory,
        {
          role: "system",
          message: `Summarize into final campaign prompt.
IMPORTANT:
- Output ONLY the campaign sentence itself.
- Wrap the prompt in double quotes.
- No greetings, no closing statements, no markdown formatting, no emojis.
Example:
"Target 25 Indian tech companies with recent funding, focusing on C-Suite executives."`,
        },
      ]);

      if (summaryPromptRaw) {
        const cleanPrompt =
          summaryPromptRaw.match(/"([^"]+)"/)?.[1] || summaryPromptRaw;
        setFinalPrompt(cleanPrompt);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "bot",
            message: `✅ Here's your campaign prompt:\n\n👉 "${cleanPrompt}"\n\nClick confirm to run workflow.`,
          },
        ]);
        setStep(1);
      }
      setUserInput("");
      setAnswers(updatedAnswers);
      return;
    }

    const botReply = await generateResponse(newHistory);
    if (botReply) {
      setChatHistory((prev) => [...prev, { role: "bot", message: botReply }]);
    } else {
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", message: "🤖 Sorry, could you rephrase that?" },
      ]);
    }

    setUserInput("");
    setAnswers(updatedAnswers);
  };

  const handleConfirm = async () => {
    if (!finalPrompt.trim()) {
      toast({ title: "⚠️ No final prompt available to send to workflow" });
      return;
    }

    try {
      setLoading(true);
      console.log("Triggering n8n with prompt:", finalPrompt);

      const response = await axios.post(
        "https://admin-zicloud1.app.n8n.cloud/webhook/prompt-intent",
        { prompt: finalPrompt },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      const people = (data?.campaignPeople || []).map((p: any) => ({
        name: p?.name || "Not Available",
        email: p?.email || "Not Available",
        designation: p?.title || "Not Available",
        linkedin_url: p?.linkedin_url || "Not Available",
        company: p?.organization_name || "Unknown Company",
        domain: "",
      }));

      const companies = (data?.campaignContacts || []).map((c: any) => ({
        company: c?.company || "Unknown",
        domain: c?.domain || "Not Available",
      }));

      localStorage.setItem("campaignPeople", JSON.stringify(people));
      localStorage.setItem("campaignContacts", JSON.stringify(companies));

      const campaignId = Date.now().toString();
      const campaign = {
        id: campaignId,
        name: finalPrompt.slice(0, 50),
        prompt: finalPrompt,
        filters: {},
        createdAt: new Date().toISOString(),
        campaignPeople: people,
        campaignContacts: companies,
      };

      const existing = JSON.parse(localStorage.getItem("campaigns") || "[]");
      existing.push(campaign);
      localStorage.setItem("campaigns", JSON.stringify(existing));
      localStorage.setItem("currentCampaignId", campaignId);

      navigate("/campaign-leads");
    } catch (error) {
      console.error("Workflow trigger error:", error);
      toast({ title: "❌ Failed to trigger workflow" });
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setAnswers({
      role: "",
      department: "",
      industry: "",
      country: "",
      additional: "",
    });
    setFinalPrompt("");
    setChatHistory([
      {
        role: "bot",
        message:
          "👋 Hi! Tell me about the leads you're looking for (e.g., 'I want Directors from the Tech industry in the US').",
      },
    ]);
    setStep(0);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Campaign Chat Assistant</h2>

        <div className="bg-muted rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {step === 0 ? (
          <div className="flex items-center gap-2">
            <input
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none"
              placeholder="Type your request..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        ) : (
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Creating..." : "Confirm & Continue"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
