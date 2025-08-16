import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Users,
  Mail,
  TrendingUp,
  Calendar,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

type CampaignPerson = {
  name: string;
  title: string;
  email: string;
  organization_name: string;
  linkedin_url: string;
  _id: string;
};

type AnalyticsData = {
  totalProspects: number;
  uniqueCompanies: number;
  emailsSentToday: number;
  responseRate: number;
  meetingsScheduled: number;
};

export default function AiSdrDashboard() {
  const [topCompanies, setTopCompanies] = useState<CampaignPerson[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/campaigns/unique-companies?limit=3`
        );
        const data = await res.json();
        setTopCompanies(data || []);
      } catch (err) {
        console.error("Failed to fetch top companies:", err);
        setTopCompanies([]);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/campaigns/analytics`);
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchTopCompanies();
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-medium">AI SDR Dashboard</h1>
            <p className="text-muted-foreground">
              Companies you're reaching out to
            </p>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {analytics?.totalProspects ?? "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Prospects
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {analytics?.emailsSentToday ?? "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Emails Sent Today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {analytics
                      ? `${(analytics.responseRate * 100).toFixed(1)}%`
                      : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">Response Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {analytics?.meetingsScheduled ?? "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Meetings Scheduled
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies List */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Top Prospect Companies</CardTitle>
            <Link to="/companies">
              <Button variant="outline" size="sm">
                View All Companies
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCompanies.length === 0 ? (
              <p className="text-muted-foreground">No companies found.</p>
            ) : (
              topCompanies.map((person, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 bg-secondary/50 rounded-md border"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="text-primary" />
                    <span className="font-medium">
                      {person.organization_name}
                    </span>
                  </div>
                  <Link
                    to={`/prospects?company=${encodeURIComponent(
                      person.organization_name
                    )}`}
                  >
                    <Button variant="outline">View Prospects</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link to="/new-campaign">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start New Campaign
            </Button>
          </Link>
          <Link to="/prospects">
            <Button variant="outline">View All Prospects</Button>
          </Link>
          <Button variant="outline">Analytics Report</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
