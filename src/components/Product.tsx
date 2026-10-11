"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";


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
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
}

export default function Product() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );
        if (!res.ok) throw new Error("Network response was not ok");

        const result = await res.json();
        const productData: ProductType[] = Array.isArray(result)
          ? result
          : result.data || [];

        setProducts(productData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleProductClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();

    if (!session) {
      toast.error("দয়া করে প্রথমে সাইন ইন করুন!");
      router.push("/signin");
      return;
    }

    router.push(`/product/${slug}`);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium">
        পণ্য লোড হচ্ছে...
      </div>
    );
  }

  const topRisers = [...products]
    .filter((item) => item.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  const topFallers = [...products]
    .filter((item) => item.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  const renderProductCard = (item: ProductType) => {
    const isUp = item.change?.dir === "up";
    const isDown = item.change?.dir === "down";

    return (
      <div
        key={item.id}
        onClick={(e) => handleProductClick(e, item.slug)}
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
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
      {topRisers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-red-600 font-bold text-xl">▲</span>
            <h2 className="text-2xl font-bold text-gray-900">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {topRisers.map(renderProductCard)}
          </div>
        </section>
      )}

      {topFallers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-emerald-600 font-bold text-xl">▼</span>
            <h2 className="text-2xl font-bold text-gray-900">
              আজ দাম কমেছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {topFallers.map(renderProductCard)}
          </div>
        </section>
      )}

     
      <section id="all-products" className="scroll-mt-8">
        <div className="mb-5 space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
          <p className="text-sm text-gray-500">
            বাজারের সকল নিত্যপ্রয়োজনীয় পণ্যের বর্তমান দাম এবং পরিবর্তন এক নজরে দেখুন।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map(renderProductCard)}
        </div>
      </section>
    </div>
  );
}