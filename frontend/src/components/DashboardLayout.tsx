import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  List,
  Megaphone,
  Archive,
  Bell,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Lists", href: "/lists", icon: List },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Archive", href: "/archive", icon: Archive },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  // refactored UI Design to be better one

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-indigo-700 to-indigo-800 text-white shadow-lg rounded-tr-2xl rounded-br-2xl p-4 flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div className="border border-white/20 rounded px-3 py-1 bg-white/10 backdrop-blur-sm">
              <span className="text-white font-bold text-lg">AI SDR</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {!collapsed && (
          <div className="text-sm text-indigo-200 mb-6">
            1,001 available | 1k
          </div>
        )}

        <nav className="flex-1 space-y-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-white/20 text-white font-semibold shadow-md"
                    : "text-indigo-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-white/20 text-indigo-200 text-sm">
            &copy; 2025 Zicloud
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 bg-white shadow-md rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="border border-gray-200 rounded px-3 py-1 bg-gray-50 text-gray-900 font-semibold">
              LOGO
            </div>
            <div className="text-sm text-gray-500">1,001 available | 1k</div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-transform"
            >
              UPGRADE
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4 text-gray-600 hover:text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4 text-gray-600 hover:text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4 text-gray-600 hover:text-blue-600" />
            </Button>
          </div>
        </header>

        {/* Content wrapper */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-inner transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
