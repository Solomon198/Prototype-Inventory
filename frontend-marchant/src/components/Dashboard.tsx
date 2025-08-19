import { useState } from "react";
import {
  Database,
  FileText,
  Users,
  Package,
  LogOut,
  User,
  BarChart3,
  Settings,
} from "lucide-react";
import { authService } from "../services/authService";

type ActiveTab = "data-types" | "fields" | "marchants" | "modules";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("data-types");

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const menuItems = [
    { id: "data-types" as ActiveTab, label: "Data Types", icon: Database },
    { id: "fields" as ActiveTab, label: "Fields", icon: FileText },
    { id: "marchants" as ActiveTab, label: "Marchants", icon: Users },
    { id: "modules" as ActiveTab, label: "Modules", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern App Bar */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
        <div className="px-6 py-4">
          {/* Top Bar with Logo and User Info */}
          <div className="flex justify-between items-center">
            {/* Logo and App Name */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  StockFlow
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  Inventory Management Platform
                </p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">
                    {authService.getUserName()}
                  </p>
                  <p className="text-xs text-blue-100">Administrator</p>
                </div>
              </div>

              {/* Settings Button */}
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                <Settings className="h-5 w-5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pb-0">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-t-lg p-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    activeTab === item.id
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {menuItems.find((item) => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">
              Manage your{" "}
              {menuItems
                .find((item) => item.id === activeTab)
                ?.label.toLowerCase()}{" "}
              efficiently
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const Icon =
                    menuItems.find((item) => item.id === activeTab)?.icon ||
                    Database;
                  return <Icon className="h-8 w-8 text-blue-600" />;
                })()}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {menuItems.find((item) => item.id === activeTab)?.label}{" "}
                Management
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This section allows you to manage your{" "}
                {menuItems
                  .find((item) => item.id === activeTab)
                  ?.label.toLowerCase()}
                . All your data is organized and easily accessible.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
