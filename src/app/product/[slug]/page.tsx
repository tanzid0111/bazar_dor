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

interface MarketType {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetailType {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  yesterday?: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
  markets?: MarketType[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );
        const data: ProductDetailType[] = await res.json();

        // Match product by slug
        const foundProduct = data.find(
          (item) => item.slug.toLowerCase() === slug.toLowerCase()
        );
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Failed to fetch product detail:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 font-medium">
        পণ্যের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          পণ্যটি পাওয়া যায়নি!
        </h2>
        <p className="text-gray-500">
          আপনি যে পণ্যটি খুঁজছেন তা বাজারে এই মুহূর্তে নেই বা ইউআরএল ভুল হতে পারে।
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

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";


  const allMins = product.markets?.map((m) => m.min) || [product.today];
  const allMaxs = product.markets?.map((m) => m.max) || [product.today];
  const minPrice = Math.min(...allMins);
  const maxPrice = Math.max(...allMaxs);
  

  const avgPrice =
    product.markets && product.markets.length > 0
      ? (
          product.markets.reduce(
            (acc, curr) => acc + (curr.min + curr.max) / 2,
            0
          ) / product.markets.length
        ).toFixed(2)
      : product.today;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
  
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-emerald-600">
          হোম
        </Link>
        <span>›</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-600 capitalize"
        >
          {product.categoryNameBn || product.category}
        </Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.nameBn}</span>
      </nav>

      
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          \
          <div className="text-5xl p-4 bg-gray-50 rounded-2xl border border-gray-100">
            {product.categoryIcon || product.image || "🛒"}
          </div>

          <div className="space-y-2">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.nameBn}
            </h1>
\
            <p className="text-gray-500 text-sm">
              {product.yesterday
                ? `গতকালকের তুলনায় আজ দাম ${
                    isUp ? "বেড়েছে" : isDown ? "কমেছে" : "একই আছে"
                  }`
                : "বাজারের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান দাম ও পরিবর্তন"}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
           \
              <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                {product.categoryNameBn || product.category}
              </span>

           \
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                প্রতি {product.unit}
              </span>
            </div>
          </div>
        </div>
\
        <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl text-center min-w-[180px] w-full md:w-auto">
          <span className="text-xs text-gray-400 block mb-1">আজকের দাম</span>
          <div className="text-3xl font-extrabold text-gray-900">
            {toBengaliNumber(product.today.toLocaleString("bn-BD"))}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">টাকা / {product.unit}</p>

          <div
            className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              isUp
                ? "bg-red-50 text-red-600"
                : isDown
                ? "bg-emerald-50 text-emerald-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span>{isUp ? "▲" : isDown ? "▼" : "-"}</span>
            <span>{toBengaliNumber(Math.abs(product.change?.pct || 0))}%</span>
          </div>
        </div>
      </div>

      
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Minimum Price */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <span className="text-xs text-gray-400 font-medium">সর্বনিম্ন দাম</span>
            <div className="text-2xl font-bold text-emerald-600">
              {toBengaliNumber(minPrice)} টাকা
            </div>
            <p className="text-xs text-gray-400">সবচেয়ে কম দামের বাজার</p>
          </div>

        
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <span className="text-xs text-gray-400 font-medium">সর্বাধিক দাম</span>
            <div className="text-2xl font-bold text-red-600">
              {toBengaliNumber(maxPrice)} টাকা
            </div>
            <p className="text-xs text-gray-400">সবচেয়ে বেশি দামের বাজার</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <span className="text-xs text-gray-400 font-medium">গড় দাম</span>
            <div className="text-2xl font-bold text-gray-900">
              {toBengaliNumber(avgPrice)} টাকা
            </div>
            <p className="text-xs text-gray-400">প্রতি {product.unit}-এর হিসাবে</p>
          </div>
        </div>
      </section>

     
      {product.markets && product.markets.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="py-3.5 px-5 font-semibold">বাজার</th>
                    <th className="py-3.5 px-5 font-semibold">বিভাগ</th>
                    <th className="py-3.5 px-5 font-semibold text-right">সর্বনিম্ন</th>
                    <th className="py-3.5 px-5 font-semibold text-right">সর্বাধিক</th>
                    <th className="py-3.5 px-5 font-semibold text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.markets.map((m, idx) => {
                    const marketAvg = ((m.min + m.max) / 2).toFixed(2);
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-5 font-medium text-gray-900">
                          {m.market}
                        </td>
                        <td className="py-4 px-5 text-gray-500">{m.division}</td>
                        <td className="py-4 px-5 text-right font-medium text-gray-800">
                          {toBengaliNumber(m.min)} টাকা
                        </td>
                        <td className="py-4 px-5 text-right font-medium text-gray-800">
                          {toBengaliNumber(m.max)} টাকা
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-gray-900">
                          {toBengaliNumber(marketAvg)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}