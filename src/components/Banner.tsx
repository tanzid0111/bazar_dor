"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Banner() {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
  
    const today = new Date();
    const formattedDate = today.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setCurrentDate(formattedDate);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="bg-[#f2f8f5] border border-gray-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-4 max-w-2xl">
       
          {currentDate && (
            <span className="inline-block bg-[#e2f2eb] text-[#0f8a4b] text-sm font-medium px-4 py-1.5 rounded-full">
              {currentDate}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-gray-600 text-base md:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div>
            <button className="bg-[#0a8748] hover:bg-[#086d3a] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              সব পণ্য দেখুন
            </button>
          </div>
        </div>

        
        <div className="mt-6 md:mt-0 flex justify-center">
          <Image
            src="/bazar-hero.png" // Public folder-e aponar image-er naam o extension dite hbe
            alt="Grocery Basket"
            width={380}
            height={300}
            style={{ width: "100%", height: "auto" }}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}