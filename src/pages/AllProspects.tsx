import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

type CampaignPerson = {
  name: string;
  title: string;
  email: string;
  organization_name: string;
  linkedin_url: string;
  _id: string;
};

export default function AllProspects() {
  const [campaignPeople, setCampaignPeople] = useState<CampaignPerson[]>([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const companyFilter = searchParams.get("company");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/campaigns/prospects"
        );
        const data = await res.json();
        setCampaignPeople(data || []);
      } catch (err) {
        console.error("Error fetching prospects:", err);
      }
    };

    fetchAll();
  }, []);

  // Filter by company or search query
  const filtered = campaignPeople.filter((p) => {
    const matchesCompany = companyFilter
      ? p.organization_name === companyFilter
      : true;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organization_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  // Group by company name
  const groupedByCompany: { [key: string]: CampaignPerson[] } = {};
  filtered.forEach((person) => {
    const org = person.organization_name;
    if (!groupedByCompany[org]) {
      groupedByCompany[org] = [];
    }
    groupedByCompany[org].push(person);
  });

  const companiesToShow = Object.keys(groupedByCompany).sort();

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">
                {companyFilter
                  ? `Prospects at ${companyFilter}`
                  : "All Prospects"}
              </h1>
              {!companyFilter && (
                <p className="text-sm text-muted-foreground">
                  Showing grouped prospects by company
                </p>
              )}
            </div>
          </div>

          <Button variant="default" onClick={() => navigate("/import")}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by company or person name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {companiesToShow.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">No prospects found.</p>
            </CardContent>
          </Card>
        ) : (
          companiesToShow.map((company) => (
            <Card key={company} className="mb-6">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{company}</CardTitle>
                {!companyFilter && (
                  <div className="flex gap-2">
                    <Link
                      to={`/prospects?company=${encodeURIComponent(company)}`}
                    >
                      <Button variant="outline" size="sm">
                        View Only
                      </Button>
                    </Link>
                    <Link to={`/email?company=${encodeURIComponent(company)}`}>
                      <Button variant="outline" size="sm">
                        Send Email
                      </Button>
                    </Link>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedByCompany[company]
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((person) => (
                    <div
                      key={person._id}
                      className="p-4 bg-secondary/50 rounded-md border"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-base font-semibold">
                            {person.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {person.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {person.email}
                          </p>
                        </div>
                        <a
                          href={person.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-5 h-5 text-blue-600 hover:underline" />
                        </a>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
