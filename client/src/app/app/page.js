"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductModal from "@/components/ui/ProductModal";
import Dashboard from "@/components/ui/Dashboard";
import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "next-themes";

const getBadgeColor = (score) => {
  const colors = {
    A: "bg-lime-200 text-lime-900 dark:bg-lime-700 dark:text-lime-100",
    B: "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100",
    C: "bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-100",
    D: "bg-amber-300 text-amber-900 dark:bg-amber-600 dark:text-amber-100",
    E: "bg-red-300 text-red-900 dark:bg-red-600 dark:text-red-100",
  };
  return (
    colors[score?.toUpperCase()] ||
    "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  );
};

const getSuggestions = (item) => {
  const lowScores = ["D", "E"];
  const suggestions = {
    milk: ["Oat Milk", "Almond Milk", "Soy Milk"],
    chocolate: ["Dark Chocolate (organic)", "Fruit-based snacks"],
    detergent: ["Eco-Friendly Detergent", "Soap Nuts", "Plant-based cleaners"],
    cereal: ["Organic Granola", "Whole Grain Oats"],
  };

  const match = Object.keys(suggestions).find((keyword) =>
    item.name?.toLowerCase().includes(keyword)
  );

  return lowScores.includes(item.ecoScore?.toUpperCase()) && match
    ? suggestions[match]
    : null;
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const openModal = (item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 font-inter bg-background text-foreground relative overflow-hidden transition-colors duration-300">
      {/* 🍃 Floating leaves & moonlit background */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Floating Leaves */}
        <img
          src="/leaf-float.png"
          className="absolute top-10 left-0 w-24 opacity-50 dark:opacity-5 animate-float-slow"
          alt="Floating leaf"
        />
        <img
          src="/leaf-float.png"
          className="absolute top-32 right-10 w-32 opacity-50 dark:opacity-5 animate-float-slower"
          alt="Floating leaf"
        />
        <img
          src="/leaf-float.png"
          className="absolute bottom-10 left-1/4 w-20 opacity-50 dark:opacity-5 animate-float-slow"
          alt="Floating leaf"
        />

        {/* Misty gradient overlay (subtle foggy vibe) */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-b from-transparent via-[#1f1e1b]/30 to-[#1f1e1b]"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <Leaf className="text-primary h-8 w-8" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary font-serif">
            SustainaCart
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full border border-border hover:bg-muted"
            title="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/saved" className="text-sm text-primary hover:underline">
            Saved
          </Link>
          <Link href="/cart" className="text-sm text-primary hover:underline">
            Cart
          </Link>
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
              className="px-4 py-2 text-sm bg-primary text-white rounded hover:brightness-90"
            >
              Login with Google
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="text-center mb-16 relative z-20">
        <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-secondary mb-4">
          Make Smart, Sustainable Choices
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Discover the eco-impact and nutritional value of products you use
          every day.
        </p>
      </section>

      {/* Search */}
      <section className="flex flex-col sm:flex-row gap-4 items-center mb-12 relative z-20">
        <input
          type="text"
          placeholder="Search grocery item (e.g., milk, cereal)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted dark:bg-card text-foreground shadow"
        />
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white font-medium hover:bg-opacity-90 transition"
        >
          <Search className="h-5 w-5" /> Search
        </button>
      </section>

      {/* Results */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20">
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
                  <Card
                    className="p-4 bg-card border border-border shadow-md hover:shadow-lg transition rounded-[24px]
 hover:scale-[1.02] hover:border-primary duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-primary">
                        {item.name}
                      </h2>
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-t-[40px] rounded-b-md shadow-sm"
                      />
                    </div>
                    <p className="text-muted-foreground mb-2">
                      <span className="font-medium">Brand:</span>{" "}
                      {item.brand || "Unknown"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge
                        variant="outline"
                        className={`${getBadgeColor(
                          item.ecoScore
                        )} font-medium`}
                      >
                        Eco Score: {item.ecoScore?.toUpperCase() || "N/A"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${getBadgeColor(
                          item.nutriScore
                        )} font-medium`}
                      >
                        Nutri Score: {item.nutriScore?.toUpperCase() || "N/A"}
                      </Badge>
                    </div>

                    {getSuggestions(item) && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-muted-foreground">
                          🌱 Consider eco-friendly alternatives:
                        </p>
                        <ul className="list-disc list-inside text-sm text-primary mt-1">
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
                              await setDoc(
                                doc(
                                  db,
                                  "users",
                                  user.uid,
                                  "favorites",
                                  item.name
                                ),
                                item
                              );
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
                              await setDoc(
                                doc(db, "users", user.uid, "cart", item.name),
                                item
                              );
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
        <p className="text-muted-foreground text-center mt-10 italic">
          Try searching for an item to explore its eco-score and nutritional
          profile.
        </p>
      )}

      {isLoading && (
        <div className="col-span-full flex justify-center items-center py-10">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="ml-4 text-primary font-medium">Searching...</p>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
      {results.length > 0 && <Dashboard data={results} />}

      <footer className="mt-20 text-center text-muted-foreground text-sm relative z-20">
        Made with ❤️ by Shruti • SustainaCart © 2025
      </footer>
    </div>
  );
}
