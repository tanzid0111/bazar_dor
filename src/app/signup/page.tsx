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
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
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
      toast.error("সোশ্যাল সাইন আপ ব্যর্থ হয়েছে!");
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
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.925-6.435-1.335-5.4-4.8 6.78-4.8 6.78-1.515.105-3.12-.765-3.12-.765-.45-1.515-1.8-2.64-3.3-2.64-1.5 0-2.85.9-3.3 2.64 0 0-1.605-.87-3.12-.765 0 0-3.465 5.16-4.8 6.78-1.35 1.62-.825 3.36-.45 3.795-.375.435-.975 1.08-1.23 1.695-.51.285-1.095 1.35-1.23 1.695-.24.675.54 1.965 4.035 1.41 0 1.005-.015 1.95-.015 2.235 0 .315.225.675.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
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