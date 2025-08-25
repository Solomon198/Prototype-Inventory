import { useState, useEffect } from "react";
import { Package, LogOut, User, BarChart3, Settings, Plus } from "lucide-react";
import { authService } from "../services/authService";
import { moduleApi, type Module } from "../services/moduleApi";
import SplashScreen from "./SplashScreen";
import DynamicForm from "./DynamicForm";
import ModuleDataRenderer from "./ModuleDataRenderer";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const merchantId = authService.getMerchantId();
      if (!merchantId) {
        setError("No merchant ID found");
        return;
      }

      const response = await moduleApi.getAll(merchantId);
      setModules(response.data || []);

      // Set the first module as active if available
      if (response.data && response.data.length > 0) {
        setActiveTab(response.data[0]._id);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch modules");
      console.error("Error fetching modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  // Show splash screen while loading
  if (loading) {
    return <SplashScreen message="Loading your modules..." />;
  }

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
        {loading ? (
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2 text-white text-sm">
                Loading modules...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 pb-4">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          </div>
        ) : modules.length > 0 ? (
          <div className="px-6 pb-0">
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-t-lg p-1">
              {modules.map((module) => (
                <button
                  key={module._id}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    activeTab === module._id
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab(module._id)}
                >
                  <Package size={18} />
                  <span>{module.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 pb-4">
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-yellow-100 text-sm">
                No modules found for this merchant
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {modules.find((module) => module._id === activeTab)?.name ||
                  "Dashboard"}
              </h2>
              <p className="text-gray-600">
                {modules.find((module) => module._id === activeTab)
                  ?.description || "Manage your module data efficiently"}
              </p>
            </div>
            {activeTab && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Create{" "}
                {modules.find((module) => module._id === activeTab)?.name}
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab && modules.find((module) => module._id === activeTab) ? (
              <ModuleDataRenderer
                key={refreshKey}
                moduleId={activeTab}
                moduleName={
                  modules.find((module) => module._id === activeTab)?.name || ""
                }
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Module Selected
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Please select a module from the navigation tabs above to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dynamic Form Modal */}
      {showCreateForm && activeTab && (
        <DynamicForm
          moduleId={activeTab}
          onClose={() => {
            setShowCreateForm(false);
            setRefreshKey((prev) => prev + 1); // Refresh the data after form closes
          }}
          moduleName={
            modules.find((module) => module._id === activeTab)?.name || ""
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
