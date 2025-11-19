"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search, ChevronDown } from "lucide-react";
import { Toaster, toast } from "sonner";
import Navbar from "../../components/Navbar";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    // Get search params from URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search");
      if (search) {
        setSearchQuery(search);
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, category, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (category && category !== "all") params.append("category", category);
      if (sortBy) params.append("sort", sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    { value: "all", label: "All Products" },
    { value: "Electronics", label: "Electronics" },
    { value: "Fashion", label: "Fashion" },
    { value: "Home", label: "Home" },
    { value: "Fitness", label: "Fitness" },
    { value: "Accessories", label: "Accessories" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Toaster position="top-right" theme="dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Shop</h1>
          <p className="text-[#9ca3af]">Browse our complete collection</p>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pl-10 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#9333ea] transition-colors duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pr-10 text-white appearance-none focus:outline-none focus:border-[#9333ea] transition-colors duration-200 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280] pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 pr-10 text-white appearance-none focus:outline-none focus:border-[#9333ea] transition-colors duration-200 cursor-pointer"
              >
                <option value="">Sort by: Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] rounded-xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#9ca3af] text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] transition-all duration-200 hover:-translate-y-1 hover:border-[#9333ea] hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="aspect-square overflow-hidden bg-[#0d0d0d]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[#9ca3af] text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#00bfff] to-[#9333ea] bg-clip-text text-transparent">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-[#6b7280] bg-[#0d0d0d] px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/product/${product.id}`}
                      className="flex-1 text-center px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] text-white rounded-lg transition-all duration-200 hover:border-[#9333ea] hover:bg-[#1a1a1a]"
                    >
                      View Details
                    </a>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
