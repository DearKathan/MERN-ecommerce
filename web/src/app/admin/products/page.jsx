"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Toaster, toast } from "sonner";
import Navbar from "../../../components/Navbar";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Toaster position="top-right" theme="dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Product Management
            </h1>
            <p className="text-[#9ca3af]">Manage all your products</p>
          </div>
          <a
            href="/admin/products/add"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </a>
        </div>

        {loading ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-[#0d0d0d] rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0d0d0d] border-b border-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#d1d5db]">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#d1d5db]">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#d1d5db]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#d1d5db]">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#d1d5db]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#0d0d0d] transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg bg-[#0d0d0d]"
                          />
                          <span className="text-white font-medium">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#d1d5db]">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#0d0d0d] text-[#9ca3af] rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#d1d5db]">
                        {product.count_in_stock}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 text-[#9333ea] hover:text-[#a855f7] transition-colors duration-200 hover:scale-110"
                          >
                            <Edit className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
