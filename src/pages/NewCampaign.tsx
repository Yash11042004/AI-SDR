import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function NewCampaign() {
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [extraPrompt, setExtraPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fullPrompt = `I want ${position || "executives"} from ${
    department || "sales"
  } department in ${industry || "tech"} industry from ${country || "USA"}, ${
    extraPrompt || "at funded companies"
  }`;

  const handleContinue = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5678/webhook-test/prompt-intent",
        {
          prompt: fullPrompt,
          filters: {
            industry: industry || "tech",
            country: country || "USA",
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      const rawPeople = data?.campaignPeople || [];
      const rawCompanies = data?.campaignContacts || [];

      const allPeople = rawPeople.map((person: any) => ({
        name: person?.name || "Not Available",
        email: person?.email || "Not Available",
        designation: person?.title || "Not Available",
        linkedin_url: person?.linkedin_url || "Not Available",
        company: person?.organization_name || "Unknown Company",
        domain: "",
      }));

      const companies = rawCompanies.map((c: any) => ({
        company: c?.company || "Unknown",
        domain: c?.domain || "Not Available",
      }));

      const campaignId = Date.now().toString();
      const campaign = {
        id: campaignId,
        name: fullPrompt.slice(0, 50),
        prompt: fullPrompt,
        filters: {
          industry: industry || "tech",
          country: country || "USA",
        },
        createdAt: new Date().toISOString(),
        campaignPeople: allPeople,
        campaignContacts: companies,
      };

      localStorage.setItem("campaignPeople", JSON.stringify(allPeople));
      localStorage.setItem("campaignContacts", JSON.stringify(companies));

      const existing = JSON.parse(localStorage.getItem("campaigns") || "[]");
      existing.push(campaign);
      localStorage.setItem("campaigns", JSON.stringify(existing));
      localStorage.setItem("currentCampaignId", campaignId);

      navigate("/campaign-leads");
    } catch (err) {
      toast.error("Something went wrong while extracting data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("Please complete the prompt to proceed.");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="text-lg font-semibold text-gray-800">
          Build your prompt:
        </div>

        {/* Prompt builder */}
        <div className="bg-gray-100 px-6 py-5 rounded-lg shadow text-lg flex flex-wrap gap-2 items-center text-gray-800">
          <span>I want</span>

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="bg-blue-100 px-2 py-1 rounded-md focus:outline-none"
          >
            <option value="">Position</option>
            <option value="Directors">Directors</option>
            <option value="Managers">Managers</option>
            <option value="Executives">Executives</option>
            <option value="Analysts">Analysts</option>
          </select>

          <span>from</span>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-green-100 px-2 py-1 rounded-md focus:outline-none"
          >
            <option value="">Department</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
          </select>

          <span>department in</span>

          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-yellow-100 px-2 py-1 rounded-md focus:outline-none"
          >
            <option value="">Industry</option>
            <option value="Tech">Tech</option>
            <option value="Pharma">Pharma</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
          </select>

          <span>industry from</span>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-pink-100 px-2 py-1 rounded-md focus:outline-none"
          >
            <option value="">Country</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
          </select>

          <span>,</span>

          {/* Floating label for extraPrompt */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              id="extraPrompt"
              value={extraPrompt}
              onChange={(e) => setExtraPrompt(e.target.value)}
              placeholder=" "
              className="peer w-full bg-purple-100 px-3 py-2 rounded-md focus:outline-none"
            />
            <label
              htmlFor="extraPrompt"
              className="absolute left-3 top-2 text-sm text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-300"
            >
              Additional details...
            </label>
          </div>
        </div>

        {/* Live preview */}
        <div className="mt-4 px-6 py-4 bg-white rounded-md shadow border border-gray-200">
          <div className="text-sm text-muted-foreground mb-1">
            Prompt Preview:
          </div>
          <div className="text-lg text-gray-800 font-medium">{fullPrompt}</div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <Link to="/ai-sdr-dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleContinue}
            disabled={loading}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {loading ? "Extracting..." : "Continue to Campaign Setup"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
