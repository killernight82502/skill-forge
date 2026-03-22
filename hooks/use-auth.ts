import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  username: string;
  gender: "male" | "female";
  isPremium: boolean;
  selectedCosmetic: string; // cosmetic skin name
  createdAt: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("skillforge_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("skillforge_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string, gender: "male" | "female" = "male", isPremium: boolean = false): boolean => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    // Store user data
    const userData: User = {
      username: username.trim(),
      gender: gender,
      isPremium: isPremium,
      selectedCosmetic: "default",
      createdAt: Date.now(),
    };

    localStorage.setItem("skillforge_user", JSON.stringify(userData));
    localStorage.setItem(`skillforge_password_${username}`, password); // Simple storage
    setUser(userData);
    return true;
  };

  const updatePremiumStatus = (isPremium: boolean) => {
    if (user) {
      const updatedUser = { ...user, isPremium };
      localStorage.setItem("skillforge_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const updateCosmetic = (cosmetic: string) => {
    if (user) {
      const updatedUser = { ...user, selectedCosmetic: cosmetic };
      localStorage.setItem("skillforge_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Cosmetic Equipped", {
        description: `Your avatar has been updated with ${cosmetic}.`,
      });
    }
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem("skillforge_user");
    }
    setUser(null);
  };

  const validateLogin = (username: string, password: string): boolean => {
    const storedPassword = localStorage.getItem(`skillforge_password_${username}`);
    return storedPassword === password;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    validateLogin,
    isLoggedIn: !!user,
    updatePremiumStatus,
    updateCosmetic,
  };
}
