"use client";

import React, { useEffect, useState } from "react";

interface ProductType {
  id: number;
  nameBn: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
}

export default function Marquee() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    async function fetchMarqueeProducts() {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );
        if (!res.ok) throw new Error("Network response was not ok");

        const result = await res.json();
        const productData = Array.isArray(result) ? result : result.data || [];
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching marquee products:", error);
      }
    }

    fetchMarqueeProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="bg-emerald-50 border-y border-emerald-100 py-2.5 overflow-hidden w-full">
      <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
        {/* First list of products */}
        <div className="flex items-center gap-8 text-sm font-medium text-emerald-900 pr-8">
          {products.map((item) => (
            <span key={`first-${item.id}`} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold">{item.nameBn}:</span>
              <span>
                {item.today} টাকা/{item.unit}
              </span>
              <span
                className={
                  item.change?.dir === "up"
                    ? "text-red-600 font-bold"
                    : item.change?.dir === "down"
                    ? "text-emerald-600 font-bold"
                    : "text-gray-500"
                }
              >
                {item.change?.dir === "up"
                  ? "▲"
                  : item.change?.dir === "down"
                  ? "▼"
                  : "-"}
                {Math.abs(item.change?.pct || 0)}%
              </span>
            </span>
          ))}
        </div>

        
        <div className="flex items-center gap-8 text-sm font-medium text-emerald-900 pr-8" aria-hidden="true">
          {products.map((item) => (
            <span key={`second-${item.id}`} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold">{item.nameBn}:</span>
              <span>
                {item.today} টাকা/{item.unit}
              </span>
              <span
                className={
                  item.change?.dir === "up"
                    ? "text-red-600 font-bold"
                    : item.change?.dir === "down"
                    ? "text-emerald-600 font-bold"
                    : "text-gray-500"
                }
              >
                {item.change?.dir === "up"
                  ? "▲"
                  : item.change?.dir === "down"
                  ? "▼"
                  : "-"}
                {Math.abs(item.change?.pct || 0)}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}