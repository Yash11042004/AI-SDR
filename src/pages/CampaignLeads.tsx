import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Search, Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockLeads = [
  { id: 1, name: 'John Smith', designation: 'CEO', companyName: 'TechCorp Inc.', email: 'john@techcorp.com', contact: '+1-555-0123', socials: '@johnsmith', selected: true },
  { id: 2, name: 'Sarah Johnson', designation: 'VP Sales', companyName: 'DataFlow LLC', email: 'sarah@dataflow.com', contact: '+1-555-0124', socials: '@sarahj', selected: true },
  { id: 3, name: 'Mike Chen', designation: 'CTO', companyName: 'StartupX', email: 'mike@startupx.io', contact: '+1-555-0125', socials: '@mikechen', selected: false },
  { id: 4, name: 'Lisa Williams', designation: 'Marketing Dir', companyName: 'GrowthCo', email: 'lisa@growthco.com', contact: '+1-555-0126', socials: '@lisaw', selected: true },
  { id: 5, name: 'David Brown', designation: 'Founder', companyName: 'InnovateLab', email: 'david@innovate.com', contact: '+1-555-0127', socials: '@davidb', selected: true },
];

export default function CampaignLeads() {
  const [leads, setLeads] = useState(mockLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handleSelectAll = (checked: boolean) => {
    setLeads(leads.map(lead => ({ ...lead, selected: checked })));
  };

  const handleSelectLead = (id: number, checked: boolean) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, selected: checked } : lead
    ));
  };

  const selectedCount = leads.filter(lead => lead.selected).length;
  const allSelected = selectedCount === leads.length;
  const someSelected = selectedCount > 0 && selectedCount < leads.length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/new-campaign">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <h1 className="text-3xl font-medium">New Campaign / Find people table</h1>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Want to make changes to the table?"
              className="pl-10 h-10"
            />
          </div>
          <Button variant="outline" className="h-10">
            <Plus className="w-4 h-4 mr-2" />
            ADD COLUMN
          </Button>
          <Button variant="outline" className="h-10">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Link to="/campaign-setup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6">
              NEXT
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-secondary/30 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Prompt text</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  Sort
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`mx-1 px-2 py-1 text-sm rounded ${
                          currentPage === pageNum ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <span className="mx-1">....{totalPages}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/20">
                  <th className="text-left p-4 w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Designation</th>
                  <th className="text-left p-4 font-medium">Company Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Socials</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-secondary/30">
                    <td className="p-4">
                      <Checkbox
                        checked={lead.selected}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, !!checked)}
                      />
                    </td>
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 text-muted-foreground">{lead.designation}</td>
                    <td className="p-4">{lead.companyName}</td>
                    <td className="p-4 text-blue-400">{lead.email}</td>
                    <td className="p-4">{lead.contact}</td>
                    <td className="p-4 text-blue-400">{lead.socials}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Info */}
        {selectedCount > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">{selectedCount}</span> of {leads.length} leads selected
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}