import { useState } from "react";
import { FileText, Package, BarChart3, ArrowLeft, Users } from "lucide-react";
import Fields from "./Fields";
import Modules from "./Modules";
import MerchantSelection from "./MerchantSelection";
import { useMerchant } from "../contexts/MerchantContext";
import type { Marchant } from "../types";
import {
  setCurrentMerchantId,
  clearCurrentMerchantId,
} from "../utils/merchantUtils";

type ActiveTab = "fields" | "modules";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("fields");
  const { selectedMerchant, setSelectedMerchant, clearSelectedMerchant } =
    useMerchant();

  const handleMerchantSelect = (merchant: Marchant) => {
    setSelectedMerchant(merchant);
    setCurrentMerchantId(merchant._id);
  };

  const handleBackToMerchantSelection = () => {
    clearSelectedMerchant();
    clearCurrentMerchantId();
  };

  const menuItems = [
    { id: "fields" as ActiveTab, label: "Fields", icon: FileText },
    { id: "modules" as ActiveTab, label: "Modules", icon: Package },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "fields":
        return <Fields />;
      case "modules":
        return <Modules />;
      default:
        return <Fields />;
    }
  };

  // If no merchant is selected, show merchant selection
  if (!selectedMerchant) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Modern App Bar */}
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
          <div className="px-6 py-4">
            {/* Top Bar with Logo and App Name */}
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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <MerchantSelection onMerchantSelect={handleMerchantSelect} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern App Bar */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
        <div className="px-6 py-4">
          {/* Top Bar with Logo and App Name */}
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

            {/* Merchant Info and Back Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">{selectedMerchant.name}</p>
                  <p className="text-xs text-blue-100">Selected Merchant</p>
                </div>
              </div>

              <button
                onClick={handleBackToMerchantSelection}
                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Change Merchant</span>
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
              efficiently for {selectedMerchant.name}
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
