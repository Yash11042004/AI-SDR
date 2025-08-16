import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Crown,
  FileText,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
  Cloud,
} from "lucide-react";
import { Link } from "react-router-dom";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", isActive: true },
  { icon: Megaphone, label: "Campaigns", isActive: false },
  { icon: Users, label: "Prospects", isActive: false },
  { icon: BarChart3, label: "Analytics", isActive: false },
];

const featureCards = [
  {
    icon: Headphones,
    title: "AI SDR",
    description:
      "Automate outreach and qualifies leads through smart conversations.",
  },
  {
    icon: FileText,
    title: "Invoice",
    description:
      "Automate invoice processing, and tracking with smart data extraction",
  },
];

export default function Dashboard() {
  return (
    <div className="bg-[#101012] flex w-full min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[65%] max-w-[240px] min-h-full bg-white rounded-r-2xl relative p-5 shadow-xl border-r border-gray-200">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-[#101012]" />
            <span className="text-lg font-semibold text-[#101012]">
              Zi Cloud
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="w-[34px] h-[34px] bg-[#101012] border-[3px] border-[#f7f5f2] hover:bg-[#101012]"
          >
            <ArrowLeft className="w-[20px] h-[20px] text-white" />
          </Button>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`$${
                  item.isActive
                    ? "bg-[#f7f5f2] border-l-4 border-gradient-to-b from-[#FFAD00] to-[#FF6D62]"
                    : "bg-white"
                } flex items-center gap-4 px-6 py-3 rounded-md`}
              >
                <item.icon className="w-6 h-6" />
                <span
                  className={`text-base font-normal $$
                    {item.isActive ? "text-[#2b2e48]" : "text-gray-600"}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 px-6 py-3">
            <Settings className="w-6 h-6" />
            <span className="text-base text-gray-600">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[35%] flex-1 flex flex-col p-10">
        {/* Header */}
        <div className="flex items-center justify-end gap-4 mb-10">
          <div className="relative w-[177px]">
            <Progress value={77} className="h-1 bg-[#e6f0ff]" />
            <div className="absolute top-[-10px] text-[10px] text-white font-bold text-center w-full">
              87/100 FREE CREDITS AVAILABLE
            </div>
          </div>

          <Button className="rounded-full bg-gradient-to-b from-[#FFAD00] to-[#FF6D62] hover:opacity-90 text-black px-4 h-9">
            <Crown className="w-4 h-4 mr-2" /> UPGRADE
          </Button>

          <Button variant="ghost" size="icon" className="w-7 h-7">
            <Bell className="w-5 h-5 text-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 bg-white rounded-full"
          >
            <HelpCircle className="w-4 h-4 text-black" />
          </Button>

          <Avatar className="w-7 h-7">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        {/* Centered Content */}
        <div className="flex flex-1 flex-col justify-center items-center text-center">
          <h1 className="text-3xl text-[#b8b8c6] mb-2">
            Welcome to Zi Cloud Dashboard!
          </h1>
          <p className="text-base text-[#b8b8c6] mb-10">How can we help you?</p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {featureCards.map((card, index) => {
              const isAiSdr = card.title === "AI SDR";
              const cardContent = (
                <Card
                  key={index}
                  className="bg-[#1b1918] border border-[#343434] rounded-2xl h-full"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-[63px] h-[63px] bg-[#ffad001a] border border-[#ffad003d] rounded-full flex items-center justify-center">
                      <card.icon className="w-6 h-6 text-[#ffad00]" />
                    </div>
                    <h2 className="text-white text-xl font-bold">
                      {card.title}
                    </h2>
                    <p className="text-[#b8b8c6] text-sm">{card.description}</p>
                  </CardContent>
                </Card>
              );

              return isAiSdr ? (
                <Link
                  to="/ai-sdr-dashboard"
                  key={index}
                  className="hover:opacity-90"
                >
                  {cardContent}
                </Link>
              ) : (
                cardContent
              );
            })}
          </div>

          <p className="text-[#454545] text-sm">many more coming soon...</p>
        </div>
      </div>
    </div>
  );
}
