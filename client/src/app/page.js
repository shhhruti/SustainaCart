// app/page.js
"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, provider } from "@/lib/firebase";
import {
  Leaf,
  TreePine,
  ScanSearch,
  ShoppingCart,
  ShieldCheck,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      router.push("/app");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-background text-foreground font-inter overflow-hidden relative">
      {/* 🍃 Floating Leaves */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/leaf-float.png"
          className="absolute top-20 left-10 w-32 opacity-30 animate-float-slow"
          alt=""
        />
        <img
          src="/leaf-float.png"
          className="absolute bottom-10 right-10 w-40 opacity-40 animate-float-slower"
          alt=""
        />
      </div>

      {/* 🔝 Header */}
      <header className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:px-12">
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
          <a
            href="#features"
            className="mt-8 inline-block animate-bounce text-primary hover:text-secondary transition"
            title="Scroll down"
          >
            ↓
          </a>
        </div>
      </header>

      {/* 🌿 Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        <Leaf className="h-12 w-12 text-primary mb-4 animate-spin-slow" />
        <h1 className="text-5xl sm:text-6xl font-bold font-serif text-primary mb-4">
          Welcome to SustainaCart
        </h1>
        <p className="text-lg sm:text-xl max-w-xl text-muted-foreground mb-8">
          Make smarter, sustainable grocery choices. Know your eco-score, track
          nutrition, and explore mindful living.
        </p>
        {!user && (
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition"
          >
            🌱 Login to Get Started
          </button>
        )}
      </section>

      {/* ✨ Features */}
      <section
        id="features"
        className="relative z-10 px-6 py-16 bg-muted/30 text-center"
      >
        <h2 className="text-3xl font-semibold mb-6 text-secondary font-serif">
          Why SustainaCart?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <ScanSearch className="w-8 h-8 text-primary" />,
              title: "Smart Search",
              desc: "Quickly check product eco & nutrition scores.",
            },
            {
              icon: <TreePine className="w-8 h-8 text-green-700" />,
              title: "Sustainable Picks",
              desc: "Get eco-friendly alternatives for harmful products.",
            },
            {
              icon: <ShoppingCart className="w-8 h-8 text-yellow-700" />,
              title: "Save & Cart",
              desc: "Save favorites and add directly to your cart.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-blue-700" />,
              title: "Privacy First",
              desc: "We don’t track or sell your data. Ever.",
            },
          ].map((f, idx) => (
            <motion.div
              key={idx}
              className="bg-card border border-border p-6 rounded-2xl shadow hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📝 Blog */}
      <section className="relative z-10 px-6 py-20 bg-background text-center">
        <h2 className="text-3xl font-semibold mb-8 font-serif text-primary">
          Sustainability Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "5 Eco-Friendly Alternatives to Common Groceries",
              desc: "Switch to oat milk, eco-detergents, and organic granola for a greener kitchen.",
            },
            {
              title: "Understanding NutriScore & EcoScore",
              desc: "Learn how these labels guide your health and environmental impact.",
            },
            {
              title: "How One Purchase Can Reduce 10kg CO₂",
              desc: "Real stats on how smarter shopping makes a real difference.",
            },
          ].map((post, idx) => (
            <motion.div
              key={idx}
              className="bg-muted p-6 rounded-xl shadow-md hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-2 text-secondary">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground">{post.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 bg-background text-center">
  <h2 className="text-3xl font-semibold mb-4 text-secondary font-serif">Stay in the Loop</h2>
  <p className="text-muted-foreground mb-6">Get eco-living tips, product updates & exclusive insights in your inbox.</p>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      alert("Thank you for subscribing!");
    }}
    className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
  >
    <input
      type="email"
      placeholder="Enter your email"
      required
      className="px-4 py-3 w-full sm:w-auto rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <button
      type="submit"
      className="px-6 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition"
    >
      Subscribe
    </button>
  </form>
</section>


      {/* 🔻 Footer */}
      <footer className="text-center text-sm text-muted-foreground py-10 relative z-10">
        Made with ❤️ by Shruti • SustainaCart © 2025
      </footer>
    </main>
  );
}
