import type { User } from "../types";
import API_URL from "./api";



export const signup = async (email: string, password: string): Promise<User> => {
  
  console.log(email);
  console.log(password);

  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data: User = await response.json();
  
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};


export const login = async (email: string, password: string): Promise<User> => {

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data: User = await response.json();
  
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};



export const logout = () => {
  localStorage.removeItem("user");
};



export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};



