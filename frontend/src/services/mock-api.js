// Temporary mock API for development until backend is running
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

export const mockAuthApi = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: `mock-jwt-token-${user.id}`,
      token_type: "bearer",
      user: userWithoutPassword,
    };
  },

  register: async (email, password, companyName) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
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
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { message: "Logged out successfully" };
  },

  verifyToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const token = localStorage.getItem("auth_token");
    if (!token || !token.startsWith("mock-jwt-token-")) {
      throw new Error("Invalid token");
    }

    const userId = parseInt(token.split("-").pop());
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  },
};
