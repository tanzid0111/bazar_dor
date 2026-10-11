"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const inputClass =
  "w-full bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-emerald-600 rounded-xl px-4 py-3 text-sm text-gray-800 transition-colors";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password) {
      toast.error("সবগুলো ঘর পূরণ করা আবশ্যক!");
      return;
    }

    if (password !== confirmPassword) {
      const msg = "পাসওয়ার্ড মিলছে না!";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("অ্যাকাউন্ট তৈরি হচ্ছে...");

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    setLoading(false);
    toast.dismiss(toastId);

    if (error) {
      const message =
        error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।"
          : error.message ?? "কিছু ভুল হয়েছে";
      setErrorMsg(message);
      toast.error(message);
      return;
    }

    if (data) {
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
      router.push("/"); 
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("সোশ্যাল সাইন আপ ব্যর্থ হয়েছে!");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f3f6f3] flex flex-col justify-center items-center p-4 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-gray-500 text-sm">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-8 w-full max-w-md">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">নাম</label>
            <input
              name="name"
              type="text"
              required
              placeholder="যেমন: রহিম উদ্দিন"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">ইমেইল</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">পাসওয়ার্ড</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="আবার লিখুন"
              className={inputClass}
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#048848] hover:bg-[#036c39] text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 font-medium">
            অথবা
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
          >
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
          >
            GitHub
          </button>
        </div>

        <div className="text-center mt-6 text-xs">
          <span className="text-gray-500">অ্যাকাউন্ট আছে? </span>
          <a href="/signin" className="text-[#048848] font-bold hover:underline">
            সাইন ইন করুন
          </a>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-xs text-gray-500 hover:text-gray-700 font-medium">
          ← হোম পেজে ফিরে যান
        </a>
      </div>
    </div>
  );
};

export default SignUpPage;