"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";


const toBengaliNumber = (num: number | string): string => {
  if (num === undefined || num === null) return "";
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return num
    .toString()
    .split("")
    .map((char) => {
      const index = englishDigits.indexOf(char);
      return index !== -1 ? bengaliDigits[index] : char;
    })
    .join("");
};

interface ProductType {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        
        const result = await res.json();
        const productData: ProductType[] = Array.isArray(result) ? result : result.data || [];

       
        const filtered = productData.filter(
          (item) => item.category?.toLowerCase() === slug.toLowerCase()
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [slug]);


  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortOption === "price-asc") {
      return sorted.sort((a, b) => a.today - b.today);
    }
    if (sortOption === "price-desc") {
      return sorted.sort((a, b) => b.today - a.today);
    }
    return sorted;
  };

  const displayProducts = getSortedProducts();
  const categoryTitle = displayProducts[0]?.categoryNameBn || slug;

  
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 font-medium">
        পণ্য লোড হচ্ছে...
      </div>
    );
  }

  
  if (products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি!
        </h2>
        <p className="text-gray-500">
          দয়া করে সঠিক ক্যাটাগরি ব্রাউজ করুন অথবা হোম পেজে ফিরে যান।
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
     
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xs">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {categoryTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
        </p>
      </div>

     
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-600">
            সাজান:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

    
      <div className="text-xs text-gray-500 px-1">
        মোট {toBengaliNumber(displayProducts.length)}টি পণ্য দেখানো হচ্ছে
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {displayProducts.map((item) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";

          return (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="bg-[#f2f8f5] hover:bg-[#eaf4ef] transition-all duration-200 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl p-2 bg-white rounded-xl shadow-xs">
                  {item.categoryIcon || item.image || "🛒"}
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {item.nameBn}
                  </h3>
                  <p className="text-xs text-gray-500">প্রতি {item.unit}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-end justify-between">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">
                    আজকের দাম
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {toBengaliNumber(item.today.toLocaleString("bn-BD"))} টাকা
                  </span>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    isUp
                      ? "bg-red-50 text-red-600"
                      : isDown
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span>{isUp ? "▲" : isDown ? "▼" : "-"}</span>
                  <span>
                    {toBengaliNumber(Math.abs(item.change?.pct || 0))}%
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}