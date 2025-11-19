"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Toaster, toast } from "sonner";
import Navbar from "../../../components/Navbar";

export default function ProductDetailsPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart!`);
  };

  const buyNow = () => {
    addToCart();
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-[#1a1a1a] aspect-square rounded-xl animate-pulse"></div>
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] h-10 w-3/4 rounded animate-pulse"></div>
              <div className="bg-[#1a1a1a] h-20 rounded animate-pulse"></div>
              <div className="bg-[#1a1a1a] h-10 w-1/2 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Product not found</h1>
            <a
              href="/shop"
              className="text-[#9333ea] hover:text-[#a855f7] underline"
            >
              Back to shop
            </a>
          </div>
        </div>
      </div>
    );
  }

  const inStock = product.count_in_stock > 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Toaster position="top-right" theme="dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00bfff] to-[#a855f7] bg-clip-text text-transparent mb-2">
                {product.name}
              </h1>
              <p className="text-[#9ca3af] text-lg">{product.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-white">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span
                className={`px-4 py-2 rounded-lg font-semibold ${
                  inStock
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-[#d1d5db] font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-lg transition-all duration-200 hover:border-[#9333ea] active:scale-95"
                    disabled={!inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold text-white w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-lg transition-all duration-200 hover:border-[#9333ea] active:scale-95"
                    disabled={!inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={!inStock}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#0d0d0d] border-2 border-[#9333ea] text-white rounded-xl font-semibold transition-all duration-200 hover:bg-[#9333ea] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={buyNow}
                  disabled={!inStock}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Product Details</h3>
              <div className="space-y-2 text-[#9ca3af]">
                <p>
                  <span className="text-[#d1d5db]">Category:</span>{" "}
                  {product.category}
                </p>
                <p>
                  <span className="text-[#d1d5db]">Stock:</span>{" "}
                  {product.count_in_stock} units available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
