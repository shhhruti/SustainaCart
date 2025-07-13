"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getBadgeColor = (score) => {
  const colors = {
    A: "bg-green-100 text-green-800",
    B: "bg-lime-100 text-lime-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-orange-100 text-orange-800",
    E: "bg-red-100 text-red-800",
  };
  const grade = score?.toUpperCase();
  return colors[grade] || "bg-gray-100 text-gray-600";
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged(async (usr) => {
      if (usr) {
        setUser(usr);
        const col = collection(db, "users", usr.uid, "cart");
        const snap = await getDocs(col);
        setCartItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setUser(null);
        setCartItems([]);
      }
      setLoading(false);
    });
  }, []);

  const removeFromCart = async (item) => {
    await deleteDoc(doc(db, "users", user.uid, "cart", item.id));
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const totalPrice = cartItems.reduce((sum, itm) => sum + (parseFloat(itm.price) || 0), 0);

  if (loading) return <p>Loading your cart…</p>;

  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 bg-white dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-700">🛒 Your Cart</h1>
        <Link href="/" className="text-green-600 hover:underline">← Back to Search</Link>
      </div>

      {!user && <p>Please log in to view your cart.</p>}

      {user && cartItems.length === 0 && <p>Your cart is empty.</p>}

      {user && cartItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 bg-white dark:bg-zinc-800 border rounded-xl shadow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-lg text-green-800 dark:text-green-200">
                    {item.name}
                  </h2>
                  <button onClick={() => removeFromCart(item)} className="text-red-500 hover:underline text-sm">Remove</button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Price: ₹{item.price}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className={getBadgeColor(item.ecoScore)}>Eco: {item.ecoScore?.toUpperCase()}</Badge>
                  <Badge variant="outline" className={getBadgeColor(item.nutriScore)}>Nutri: {item.nutriScore?.toUpperCase()}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
            <Link href="/checkout" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 mt-4 sm:mt-0">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
