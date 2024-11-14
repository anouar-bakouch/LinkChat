import { User } from "../models/User";


export async function registerUser(userData:User) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      throw new Error("Registration failed");
    }
  
    return await response.json();
  }