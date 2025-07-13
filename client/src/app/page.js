"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import ProductModal from "@/components/ui/ProductModal";
import Dashboard from "@/components/ui/Dashboard";

import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "next-themes";

const getBadgeColor = (score) => {
  const colors = {
    A: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    B: "bg-lime-100 text-lime-800 dark:bg-lime-800 dark:text-lime-100",
    C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    D: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
    E: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  };
  const grade = score?.toUpperCase();
  return colors[grade] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
};

const getSuggestions = (item) => {
  const lowScores = ["D", "E"];
  const suggestions = {
    milk: ["Oat Milk", "Almond Milk", "Soy Milk"],
    chocolate: ["Dark Chocolate (organic)", "Fruit-based snacks"],
    detergent: ["Eco-Friendly Detergent", "Soap Nuts", "Plant-based cleaners"],
    cereal: ["Organic Granola", "Whole Grain Oats"],
  };

  const keywords = Object.keys(suggestions);
  const matches = keywords.filter((keyword) =>
    item.name?.toLowerCase().includes(keyword)
  );

  if (lowScores.includes(item.ecoScore?.toUpperCase()) && matches.length > 0) {
    return suggestions[matches[0]];
  }
  return null;
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { theme, setTheme } = useTheme();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/search?query=${query}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Could not connect to the backend.");
      setResults([]);
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-zinc-900 dark:to-zinc-950 px-6 py-10 sm:px-12 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Leaf className="text-green-600 dark:text-green-400 h-8 w-8" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 dark:text-green-200 tracking-tight">
            SustainaCart
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-sm p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/saved" className="text-sm text-green-600 hover:underline">Saved</Link>
          <Link href="/cart" className="text-sm text-green-600 hover:underline">Cart</Link>

          {user ? (
            <>
              <p className="text-sm">Hi, {user.displayName?.split(" ")[0]}</p>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Login with Google
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-100 mb-3">
          Make Smart, Sustainable Choices
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
          Discover the eco-impact and nutritional value of products you use every day.
        </p>
      </section>

      {/* Search */}
      <section className="flex flex-col sm:flex-row gap-4 items-center mb-10">
        <input
          type="text"
          placeholder="Search grocery item (e.g., milk, cereal)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 border border-green-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 shadow"
        />
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          <Search className="h-5 w-5" /> Search
        </button>
      </section>

      {/* Results */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {!isLoading &&
            results.map((item, index) => (
              <motion.div
                key={item.name + index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="cursor-pointer" onClick={() => openModal(item)}>
                  <Card className="p-4 bg-white dark:bg-zinc-900 border border-green-100 dark:border-zinc-700 shadow-md hover:shadow-lg transition rounded-xl hover:scale-[1.02] hover:border-green-300 duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                        {item.name}
                      </h2>
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.name}
                        className="h-12 w-12 object-contain rounded"
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium">Brand:</span>{" "}
                      {item.brand || "Unknown"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className={`${getBadgeColor(item.ecoScore)} font-medium`}>
                        Eco Score: {item.ecoScore?.toUpperCase() || "N/A"}
                      </Badge>
                      <Badge variant="outline" className={`${getBadgeColor(item.nutriScore)} font-medium`}>
                        Nutri Score: {item.nutriScore?.toUpperCase() || "N/A"}
                      </Badge>
                    </div>

                    {getSuggestions(item) && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          🌱 Consider eco-friendly alternatives:
                        </p>
                        <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 mt-1">
                          {getSuggestions(item).map((alt, i) => (
                            <li key={i}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {user && (
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await setDoc(doc(db, "users", user.uid, "favorites", item.name), item);
                              alert("❤️ Saved to Favorites!");
                            } catch (err) {
                              console.error("Save failed:", err);
                              alert("Failed to save.");
                            }
                          }}
                          className="px-3 py-1 text-sm bg-pink-500 text-white rounded hover:bg-pink-600"
                        >
                          ❤️ Save
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await setDoc(doc(db, "users", user.uid, "cart", item.name), item);
                              alert("🛒 Added to Cart!");
                            } catch (err) {
                              console.error("Cart error:", err);
                              alert("Failed to add to cart.");
                            }
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    )}
                  </Card>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </section>

      {!isLoading && results.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10 italic">
          Try searching for an item to explore its eco-score and nutritional profile.
        </p>
      )}

      {isLoading && (
        <div className="col-span-full flex justify-center items-center py-10">
          <div className="h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="ml-4 text-green-700 dark:text-green-300 font-medium">Searching...</p>
        </div>
      )}

      <ProductModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />
      {results.length > 0 && <Dashboard data={results} />}

      <footer className="mt-20 text-center text-gray-400 text-sm">
        Made with ❤️ by Shruti • SustainaCart © 2025
      </footer>
    </div>
  );
}
