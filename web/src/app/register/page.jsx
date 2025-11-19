"use client";

import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Toaster, toast } from "sonner";
import Navbar from "../../components/Navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Account created successfully!");

      // Check for redirect or go home
      const redirect = localStorage.getItem("redirectAfterLogin");
      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirect;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Toaster position="top-right" theme="dark" />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Create Account
            </h1>
            <p className="text-[#9ca3af] text-center mb-8">
              Join NeonShop today
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#d1d5db] font-medium mb-2">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pl-11 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
                    placeholder="John Doe"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                </div>
              </div>

              <div>
                <label className="block text-[#d1d5db] font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pl-11 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                </div>
              </div>

              <div>
                <label className="block text-[#d1d5db] font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pl-11 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                </div>
                <p className="text-xs text-[#6b7280] mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#9ca3af]">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#9333ea] hover:text-[#a855f7] font-semibold transition-colors duration-200"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
