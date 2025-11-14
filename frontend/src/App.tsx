import { Toaster as Sonner } from "./components/ui/sonner"; // use this only
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import AiSdrDashboard from "./pages/AiSdrDashboard";
import NewCampaign from "./pages/NewCampaign";
import CampaignLeads from "./pages/CampaignLeads";
import NotFound from "./pages/NotFound";
import AllProspects from "./pages/AllProspects";
import AllCompanies from "./pages/AllCompanies";
import ImportPage from "./pages/ImportPage";
import LoginPage from "./pages/loginPage";
import SendEmail from "./pages/SendEmail";
import SentEmails from "./pages/SentEmails";
// this is just a commit

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ✅ Only keep Sonner and configure it */}
      <Sonner
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "text-base px-6 py-4 font-medium",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-sdr-dashboard" element={<AiSdrDashboard />} />
          <Route path="/new-campaign" element={<NewCampaign />} />
          <Route path="/campaign-leads" element={<CampaignLeads />} />
          <Route path="/prospects" element={<AllProspects />} />
          <Route path="/companies" element={<AllCompanies />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/test-login" element={<LoginPage />} />
          <Route path="/email" element={<SendEmail />} />
          <Route path="/sent-emails" element={<SentEmails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
