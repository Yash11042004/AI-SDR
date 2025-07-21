import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Mail, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AiSdrDashboard() {
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
            <p className="text-muted-foreground">Manage your AI-powered sales development</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-xs text-muted-foreground">Active Prospects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">1,423</p>
                  <p className="text-xs text-muted-foreground">Emails Sent Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">23.5%</p>
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
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Meetings Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded">
                <div>
                  <p className="font-medium">Email sent to John Smith</p>
                  <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded">
                <div>
                  <p className="font-medium">Follow-up scheduled</p>
                  <p className="text-sm text-muted-foreground">Sarah Johnson - DataFlow LLC</p>
                </div>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded">
                <div>
                  <p className="font-medium">New lead qualified</p>
                  <p className="text-sm text-muted-foreground">Mike Chen - StartupX</p>
                </div>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Q4 Enterprise Outreach</span>
                  <span className="text-sm text-muted-foreground">32% open rate</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '32%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">SaaS Startup Series</span>
                  <span className="text-sm text-muted-foreground">28% open rate</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '28%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Holiday Special</span>
                  <span className="text-sm text-muted-foreground">25% open rate</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link to="/new-campaign">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start New Campaign
            </Button>
          </Link>
          <Button variant="outline">
            View All Prospects
          </Button>
          <Button variant="outline">
            Analytics Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}