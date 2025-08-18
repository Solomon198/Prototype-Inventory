import { useState } from "react";
import { Database, FileText, Users, Package } from "lucide-react";
import DataTypes from "./DataTypes";
import Fields from "./Fields";
import Marchants from "./Marchants";
import Modules from "./Modules";

type ActiveTab = "data-types" | "fields" | "marchants" | "modules";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("data-types");

  const menuItems = [
    { id: "data-types" as ActiveTab, label: "Data Types", icon: Database },
    { id: "fields" as ActiveTab, label: "Fields", icon: FileText },
    { id: "marchants" as ActiveTab, label: "Marchants", icon: Users },
    { id: "modules" as ActiveTab, label: "Modules", icon: Package },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "data-types":
        return <DataTypes />;
      case "fields":
        return <Fields />;
      case "marchants":
        return <Marchants />;
      case "modules":
        return <Modules />;
      default:
        return <DataTypes />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Management System
          </h1>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
