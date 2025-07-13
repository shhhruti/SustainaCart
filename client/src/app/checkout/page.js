"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged(async (usr) => {
      if (usr) {
        setUser(usr);
        const snap = await getDocs(collection(db, "users", usr.uid, "cart"));
        setCartItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    });
  }, []);

  const handlePlaceOrder = async () => {
    // In a real app, you'd process payment here
    // For demo: clear the cart:
    await Promise.all(cartItems.map(item => deleteDoc(doc(db, "users", user.uid, "cart", item.id))));
    setOrderPlaced(true);
    setCartItems([]);
  };

  if (loading) return <p>Loading checkout…</p>;
  if (!user) return <p>Please log in to checkout.</p>;

  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 bg-white dark:bg-zinc-900">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Checkout</h1>

      {orderPlaced ? (
        <div className="bg-green-100 text-green-800 p-6 rounded">
          🎉 Thank you for your order! It’s been placed successfully.
          <Link href="/" className="block mt-4 underline text-green-600">Continue Shopping</Link>
        </div>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty. <Link href="/" className="underline text-green-600">Search items</Link></p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white dark:bg-zinc-800 p-4 rounded-xl shadow">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🧾 Place Order
          </button>
        </>
      )}
    </div>
  );
}
