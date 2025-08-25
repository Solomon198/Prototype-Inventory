import api from "./api";

interface LoginResponse {
  message: string;
  success: boolean;
  user?: {
    message: string;
    user: {
      _id: string;
      name: string;
      merchantId: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      id: string;
    };
  };
}

class AuthService {
  private isAuthenticated = false;
  private userName = "";
  private merchantId = "";

  async login(name: string): Promise<LoginResponse> {
    try {
      const response = await api.post("/api/login", { name });

      if (response.data.user) {
        this.isAuthenticated = true;
        this.userName = name;
        this.merchantId = response.data.user.merchantId;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("merchantId", response.data.user.merchantId);
      }

      return {
        success: true,
        message: "Login successful",
        user: response.data.user,
      };
    } catch {
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userName = "";
    this.merchantId = "";
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("merchantId");
  }

  checkAuthStatus(): boolean {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedName = localStorage.getItem("userName");
    const storedMerchantId = localStorage.getItem("merchantId");

    if (storedAuth === "true" && storedName && storedMerchantId) {
      this.isAuthenticated = true;
      this.userName = storedName;
      this.merchantId = storedMerchantId;
      return true;
    }

    return false;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserName(): string {
    return this.userName;
  }

  getMerchantId(): string {
    return this.merchantId;
  }
}

export const authService = new AuthService();
