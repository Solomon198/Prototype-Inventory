import { useState, useEffect } from "react";
import { Users, ArrowRight, Building2, Database, Settings } from "lucide-react";
import type { Marchant } from "../types";
import { marchantApi } from "../services/api";
import DataTypes from "./DataTypes";
import Marchants from "./Marchants";

interface MerchantSelectionProps {
  onMerchantSelect: (merchant: Marchant) => void;
}

type AdminTab = "select-merchant" | "manage-merchants" | "data-types";

const MerchantSelection = ({ onMerchantSelect }: MerchantSelectionProps) => {
  const [merchants, setMerchants] = useState<Marchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("select-merchant");

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await marchantApi.getAll();
      setMerchants(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch merchants");
      console.error("Error fetching merchants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantSelect = (merchant: Marchant) => {
    onMerchantSelect(merchant);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading merchants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMerchants}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const adminTabs = [
    { id: "select-merchant" as AdminTab, label: "Select Merchant", icon: Users },
    { id: "manage-merchants" as AdminTab, label: "Manage Merchants", icon: Building2 },
    { id: "data-types" as AdminTab, label: "Data Types", icon: Database },
  ];

  const renderAdminContent = () => {
    switch (activeTab) {
      case "select-merchant":
        return (
          <div>
            {merchants.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Merchants Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no merchants available. Please add some merchants to get started.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Merchant
                  </h2>
                  <p className="text-gray-600">
                    Choose a merchant to access their inventory management dashboard
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {merchants.map((merchant) => (
                    <div
                      key={merchant._id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      onClick={() => handleMerchantSelect(merchant)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {merchant.name}
                      </h3>

                      {merchant.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {merchant.description}
                        </p>
                      )}

                      <div className="space-y-1 text-sm text-gray-500">
                        {merchant.email && <p className="truncate">{merchant.email}</p>}
                        {merchant.phone && <p>{merchant.phone}</p>}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            merchant.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {merchant.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "data-types":
        return <DataTypes />;
      case "manage-merchants":
        return <Marchants />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Admin Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderAdminContent()}
    </div>
  );
};

export default MerchantSelection;
