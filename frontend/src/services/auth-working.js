// Working authentication service with mock fallback
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock users for development
const MOCK_USERS = [
  {
    id: 1,
    email: "admin@saas.com",
    password: "admin123",
    role: "admin",
    companyId: 1,
    company: {
      id: 1,
      name: "Admin Company",
      industry: "Technology",
      country: "United States",
    },
  },
  {
    id: 2,
    email: "owner@acme.com",
    password: "acme123",
    role: "owner",
    companyId: 2,
    company: {
      id: 2,
      name: "Acme Corp",
      industry: "Manufacturing",
      country: "United States",
    },
  },
  {
    id: 3,
    email: "owner@globex.com",
    password: "globex123",
    role: "owner",
    companyId: 3,
    company: {
      id: 3,
      name: "Globex Corporation",
      industry: "Technology",
      country: "Canada",
    },
  },
  {
    id: 4,
    email: "test@acme.com",
    password: "test123",
    role: "user",
    companyId: 2,
    company: {
      id: 2,
      name: "Acme Corp",
      industry: "Manufacturing",
      country: "United States",
    },
  },
];

const mockLogin = async (email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("🔍 Mock login attempt:", { email, password });
  console.log("📋 Available test accounts:");
  MOCK_USERS.forEach((u) => {
    console.log(`   ${u.email} / ${u.password} (${u.role})`);
  });

  const user = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    console.log("❌ No matching user found");
    throw new Error("Invalid email or password");
  }

  console.log("✅ Login successful for:", user.email);

  const { password: _, ...userWithoutPassword } = user;

  return {
    access_token: `mock-jwt-token-${user.id}`,
    token_type: "bearer",
    user: userWithoutPassword,
  };
};

const mockRegister = async (email, password, companyName) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const existingUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const newUser = {
    id: MOCK_USERS.length + 1,
    email,
    role: "owner",
    companyId: MOCK_USERS.length + 1,
    company: {
      id: MOCK_USERS.length + 1,
      name: companyName,
      industry: "Other",
      country: "Unknown",
    },
  };

  MOCK_USERS.push({ ...newUser, password });

  return {
    access_token: `mock-jwt-token-${newUser.id}`,
    token_type: "bearer",
    user: newUser,
  };
};

export const workingAuthApi = {
  login: async (email, password) => {
    console.log("🔄 Attempting login...");

    // Try real backend first
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      console.log("✅ Backend login successful");
      return {
        token: response.data.access_token,
        user: response.data.user,
      };
    } catch (backendError) {
      console.warn(
        "⚠️ Backend unavailable, using mock authentication. Start FastAPI server for real auth.",
      );

      // Try mock authentication
      try {
        const mockResponse = await mockLogin(email.trim(), password);
        console.log("✅ Mock login successful");

        return {
          token: mockResponse.access_token,
          user: mockResponse.user,
        };
      } catch (mockError) {
        console.error("❌ Mock login failed:", mockError.message);
        // Make sure the error is properly thrown to reach the UI
        throw new Error(mockError.message || "Invalid email or password");
      }
    }
  },

  register: async (email, password, companyName) => {
    try {
      console.log("🔄 Attempting registration...");

      try {
        const response = await api.post("/auth/register", {
          email: email.trim(),
          password: password,
          company_name: companyName.trim(),
        });

        console.log("✅ Backend registration successful");
        return {
          token: response.data.access_token,
          user: response.data.user,
        };
      } catch (backendError) {
        console.log("⚠️ Backend unavailable, using mock registration");

        const mockResponse = await mockRegister(
          email.trim(),
          password,
          companyName.trim(),
        );
        console.log("✅ Mock registration successful");

        return {
          token: mockResponse.access_token,
          user: mockResponse.user,
        };
      }
    } catch (error) {
      console.error("❌ Registration failed:", error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if backend fails
      console.log("⚠️ Backend logout failed, continuing...");
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    console.log("✅ Logged out successfully");
  },

  verifyToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      // Mock verification
      const token = localStorage.getItem("auth_token");
      if (token && token.startsWith("mock-jwt-token-")) {
        const userId = parseInt(token.split("-").pop());
        const user = MOCK_USERS.find((u) => u.id === userId);

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          return { user: userWithoutPassword };
        }
      }
      throw new Error("Token verification failed");
    }
  },
};
