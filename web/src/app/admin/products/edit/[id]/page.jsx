"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Toaster, toast } from "sonner";
import Navbar from "../../../../../components/Navbar";

export default function EditProductPage({ params }) {
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Electronics",
    countInStock: "",
  });

  useEffect(() => {
    // Check admin access
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (!parsedUser.isAdmin) {
      alert("Access denied. Admin privileges required.");
      window.location.href = "/";
      return;
    }

    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();

      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category,
        countInStock: data.count_in_stock,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          countInStock: parseInt(formData.countInStock),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-[#0d0d0d] rounded w-1/2"></div>
              <div className="h-32 bg-[#0d0d0d] rounded"></div>
              <div className="h-10 bg-[#0d0d0d] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Toaster position="top-right" theme="dark" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Product</h1>
          <p className="text-[#9ca3af]">Update product information</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 space-y-6"
        >
          <div>
            <label className="block text-[#d1d5db] font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-[#d1d5db] font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#d1d5db] font-medium mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-[#d1d5db] font-medium mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                required
                min="0"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#d1d5db] font-medium mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Fitness">Fitness</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-[#d1d5db] font-medium mb-2">
              Image URL *
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-[#6b7280] mt-2">
              Enter the full URL of the product image
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save className="w-5 h-5" />
              {loading ? "Updating..." : "Update Product"}
            </button>
            <a
              href="/admin/products"
              className="px-6 py-4 bg-[#0d0d0d] border-2 border-[#2a2a2a] text-white rounded-xl font-semibold transition-all duration-200 hover:border-[#9333ea]"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
