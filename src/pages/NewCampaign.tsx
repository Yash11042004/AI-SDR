import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewCampaign() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [searchLimit, setSearchLimit] = useState('');

  const steps = [
    { number: 1, name: 'Extract', active: true },
    { number: 2, name: 'Campaign Setup', active: false },
    { number: 3, name: 'Settings', active: false }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Link to="/ai-sdr-dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-medium">New Campaign</h1>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.active 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                {step.number}
              </div>
              <span className={`ml-2 ${step.active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className="mx-8 h-px bg-border flex-1 max-w-24"></div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-medium mb-8 text-center">Find people you are looking for</h2>
              
              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="type here....."
                  className="pl-12 h-12 text-lg"
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-primary"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>

              {/* Filters Row */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry"
                    className="h-12"
                  />
                </div>
                <div>
                  <Input
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    placeholder="Company Size"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Search Limit and Add Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    value={searchLimit}
                    onChange={(e) => setSearchLimit(e.target.value)}
                    placeholder="Search limit"
                    className="h-12 pr-12"
                  />
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-12 w-12 p-0 border-dashed"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Instructions */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-medium mb-3">Data Extraction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Type in data to extract email, whatsapp, linkedin, mobile no. data
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-medium mb-3">Additional Filters</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add more filters (optional)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-between">
          <Link to="/ai-sdr-dashboard">
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
          <div className="flex gap-4">
            <Button variant="outline">
              Save Draft
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Continue to Campaign Setup
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}