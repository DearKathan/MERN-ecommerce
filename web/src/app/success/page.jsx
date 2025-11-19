"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Home, Package } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function SuccessPage() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setOrderId(params.get("orderId") || "N/A");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full border-2 border-green-500 mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00bfff] to-[#a855f7] bg-clip-text text-transparent mb-4">
                Payment Successful!
              </h1>
              <p className="text-[#d1d5db] text-lg mb-2">
                Thank you for your purchase
              </p>
              <p className="text-[#9ca3af]">
                Your order has been confirmed and will be shipped soon
              </p>
            </div>

            <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#9ca3af]">Order ID</span>
                <span className="text-white font-mono font-semibold">
                  {orderId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Status</span>
                <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#0d0d0d] border-2 border-[#9333ea] text-white rounded-xl font-semibold transition-all duration-200 hover:bg-[#9333ea] hover:scale-105"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </a>
              <a
                href="/shop"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
              >
                <Package className="w-5 h-5" />
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
