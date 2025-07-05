import React, { useState } from "react";
import { authApi } from "../services/api";

export default function AuthTest() {
  const [result, setResult] = useState("");

  const testLogin = async () => {
    try {
      console.log("Testing direct authApi call...");
      const response = await authApi.login("admin@saas.com", "demo123");
      console.log("Direct API response:", response);
      setResult(`Success: ${JSON.stringify(response)}`);
    } catch (error) {
      console.log("Direct API error:", error);
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        padding: "20px",
        border: "1px solid black",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <h3>Auth Test</h3>
      <button onClick={testLogin}>Test Login</button>
      <div style={{ marginTop: "10px", fontSize: "12px" }}>{result}</div>
    </div>
  );
}
