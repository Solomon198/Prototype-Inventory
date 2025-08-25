import { BarChart3 } from "lucide-react";

interface SplashScreenProps {
  message?: string;
}

const SplashScreen = ({ message = "Loading..." }: SplashScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Main Logo */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6 animate-pulse">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>

            {/* Orbiting Dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-white/20 rounded-full animate-spin">
                <div className="w-3 h-3 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 animate-fade-in">
          StockFlow
        </h1>
        <p className="text-blue-100 text-lg font-medium mb-8 animate-fade-in-delay">
          Inventory Management Platform
        </p>

        {/* Loading Message */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-white/80 text-sm font-medium animate-fade-in-delay-2">
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-1 overflow-hidden">
            <div className="bg-white h-1 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
