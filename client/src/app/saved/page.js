"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

export default function SavedPage() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (usr) => {
      if (usr) {
        setUser(usr);
        const favsRef = collection(db, "users", usr.uid, "favorites");
        const snap = await getDocs(favsRef);
        const data = snap.docs.map((doc) => doc.data());
        setFavorites(data);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-200">
          ❤️ Your Saved Items
        </h1>
        <Link href="/" className="text-sm text-green-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {user ? (
        favorites.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            No saved items yet. Search and click “❤️ Save” on your favorite products!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item, index) => (
              <Card
                key={index}
                className="p-4 bg-white dark:bg-zinc-900 border border-green-100 dark:border-zinc-700 shadow-md rounded-xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                    {item.name || "Unnamed Product"}
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
              </Card>
            ))}
          </div>
        )
      ) : (
        <p className="text-gray-500 text-center">
          Please log in to view your saved items.
        </p>
      )}
    </div>
  );
}
