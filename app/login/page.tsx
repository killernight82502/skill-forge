"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isPremium, setIsPremium] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, validateLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError("Please enter both hunter name and power level");
        setIsLoading(false);
        return;
      }

      if (isNewUser) {
        // Create new account
        if (login(username, password, gender, isPremium)) {
          setTimeout(() => {
            router.push("/");
          }, 100);
        } else {
          setError("Failed to create account");
          setIsLoading(false);
        }
      } else {
        // Validate existing account
        if (validateLogin(username, password)) {
          const loginSuccess = login(username, password, gender, isPremium);
          if (loginSuccess) {
            setTimeout(() => {
              router.push("/");
            }, 100);
          } else {
            setError("Failed to login");
            setIsLoading(false);
          }
        } else {
          setError("Invalid hunter name or power level");
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.log("[v0] Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-black text-orange-500 drop-shadow-2xl mb-2 italic">
              TIME BOT
            </h1>
            <p className="text-5xl md:text-6xl font-black text-orange-400 drop-shadow-2xl">
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500" />
            <p className="text-orange-400 font-bold tracking-widest text-sm">
              Time that work's back
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500" />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gray-950/50 border border-orange-500/30 rounded-lg p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  setIsNewUser(true);
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                  isNewUser
                    ? "bg-orange-500 text-black shadow-lg shadow-orange-500/50"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNewUser(false);
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                  !isNewUser
                    ? "bg-orange-500 text-black shadow-lg shadow-orange-500/50"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Login
              </button>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-orange-400 text-sm font-semibold mb-2">
                Hunter Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your hunter name"
                className="w-full bg-gray-900 border border-orange-500/30 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-orange-400 text-sm font-semibold mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set your power level"
                className="w-full bg-gray-900 border border-orange-500/30 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Gender Selection - Only show on Create Account */}
            {isNewUser && (
              <div className="space-y-4">
                <div>
                  <label className="block text-orange-400 text-sm font-semibold mb-3">
                    Choose Your Form
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`flex-1 py-3 px-4 rounded font-semibold transition-all ${
                        gender === "male"
                          ? "bg-orange-500 text-black shadow-lg shadow-orange-500/50 border border-orange-600"
                          : "bg-gray-900 text-gray-400 border border-orange-500/20 hover:border-orange-500/40"
                      }`}
                    >
                      Male Hunter
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`flex-1 py-3 px-4 rounded font-semibold transition-all ${
                        gender === "female"
                          ? "bg-orange-500 text-black shadow-lg shadow-orange-500/50 border border-orange-600"
                          : "bg-gray-900 text-gray-400 border border-orange-500/20 hover:border-orange-500/40"
                      }`}
                    >
                      Female Hunter
                    </button>
                  </div>
                </div>

                {/* Premium Option */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="w-5 h-5 accent-yellow-500"
                    />
                    <div className="flex-1">
                      <span className="text-yellow-400 font-semibold">Premium Member</span>
                      <p className="text-xs text-gray-400 mt-1">
                        Unlock exclusive cosmetics and avatar frames
                      </p>
                    </div>
                    <span className="text-yellow-500 text-lg">⭐</span>
                  </label>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-4 rounded transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 disabled:shadow-none text-lg"
            >
              {isLoading ? "Connecting..." : isNewUser ? "Begin Journey" : "Ascend"}
            </button>

            {/* Info Text */}
            <p className="text-center text-gray-500 text-xs">
              {isNewUser
                ? "Create a new hunter to begin your journey"
                : "Login with your existing account to continue"}
            </p>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Defeat monsters. Earn levels. Become unstoppable.</p>
        </div>
      </div>
    </div>
  );
}
