"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Toaster, toast } from "sonner";
import Navbar from "../../components/Navbar";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item,
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      window.location.href = "/login";
    } else {
      window.location.href = "/checkout";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Toaster position="top-right" theme="dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <ShoppingBag className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-[#9ca3af] mb-6">
              Add some products to get started!
            </p>
            <a
              href="/shop"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex gap-6 transition-all duration-200 hover:border-[#9333ea]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg bg-[#0d0d0d]"
                  />

                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {item.name}
                    </h3>
                    <p className="text-[#9ca3af] mb-4">
                      ${item.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-lg transition-all duration-200 hover:border-[#9333ea] active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-lg transition-all duration-200 hover:border-[#9333ea] active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#00bfff] to-[#9333ea] bg-clip-text text-transparent">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#d1d5db]">
                    <span>Items ({totalItems})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#2a2a2a] pt-4">
                    <div className="flex justify-between text-white font-bold text-xl">
                      <span>Subtotal</span>
                      <span className="bg-gradient-to-r from-[#00bfff] to-[#9333ea] bg-clip-text text-transparent">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95"
                >
                  Proceed to Checkout
                </button>

                <a
                  href="/shop"
                  className="block text-center text-[#9ca3af] hover:text-white transition-colors duration-200 mt-4"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
