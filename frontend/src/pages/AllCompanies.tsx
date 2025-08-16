import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

type CampaignPerson = {
  name: string;
  title: string;
  email: string;
  organization_name: string;
  linkedin_url: string;
  _id: string;
};

export default function AllCompanies() {
  const [companyPeople, setCompanyPeople] = useState<CampaignPerson[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/campaigns/unique-companies`
        );
        const data = await res.json();
        setCompanyPeople(data || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">All Companies</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Companies in Latest Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {companyPeople.length === 0 ? (
              <p className="text-muted-foreground">No companies found.</p>
            ) : (
              [...companyPeople].map((person) => (
                <div
                  key={person._id}
                  className="p-4 bg-secondary/50 rounded-md border flex justify-between items-center"
                >
                  <div>
                    <p className="text-base font-semibold">
                      {person.organization_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {person.name} - {person.title}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/prospects?company=${encodeURIComponent(
                          person.organization_name
                        )}`
                      )
                    }
                  >
                    View Prospects
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
