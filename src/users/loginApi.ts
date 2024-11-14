import { LoginData } from "../models/LoginData";
import { LoginResponse } from "../models/LoginResponse";


export async function loginUser(loginData: LoginData): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Login failed");
  }

  return await response.json();
}