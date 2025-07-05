import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthTestSimple() {
  const { login } = useAuth();

  const forceLogin = async () => {
    try {
      console.log("=== FORCING LOGIN ===");

      // Directly set user in localStorage and force success
      const mockUser = { email: "admin@saas.com", role: "admin", id: 1 };
      const mockToken = "mock-token-123";

      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      console.log("Mock data stored:", { mockUser, mockToken });

      // Refresh page to trigger auth context update
      window.location.reload();
    } catch (error) {
      console.error("Force login error:", error);
    }
  };

  const testSimpleLogin = async () => {
    console.log("=== TESTING SIMPLE LOGIN ===");
    const result = await login("admin@saas.com", "demo123");
    console.log("Simple login result:", result);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "red",
        color: "white",
        padding: "20px",
        border: "1px solid black",
        zIndex: 9999,
        maxWidth: "200px",
      }}
    >
      <h3>Simple Auth Test</h3>
      <button
        onClick={testSimpleLogin}
        style={{ display: "block", margin: "5px 0" }}
      >
        Test Login
      </button>
      <button
        onClick={forceLogin}
        style={{ display: "block", margin: "5px 0" }}
      >
        Force Login
      </button>
    </div>
  );
}
