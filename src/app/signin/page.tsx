"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const inputClass =
  "input input-bordered w-full bg-gray-50/50 border-gray-200 focus:outline-none focus:border-emerald-600 rounded-lg text-sm";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড আবশ্যক!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("লগইন হচ্ছে...");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);
    toast.dismiss(toastId);

    if (error) {
      const message =
        error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।"
          : error.message ?? "কিছু ভুল হয়েছে";
      setErrorMsg(message);
      toast.error(message);
      return;
    }

    if (data) {
      toast.success("সাইন ইন সম্পূর্ণ হয়েছে! স্বাগতম।");
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col justify-center items-center p-4 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">সাইন ইন করুন</h1>
        <p className="text-gray-500 text-sm">
          আপনার ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্টে প্রবেশ করুন।
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="form-control">
            <label className="label pl-0 pt-0 pb-1">
              <span className="label-text font-bold text-gray-800">ইমেইল</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="form-control">
            <label className="label pl-0 pt-0 pb-1">
              <span className="label-text font-bold text-gray-800">পাসওয়ার্ড</span>
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="পাসওয়ার্ড লিখুন"
              className={inputClass}
            />
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-[#048848] hover:bg-[#036c39] text-white border-none rounded-lg mt-2 text-base font-semibold normal-case shadow-sm disabled:opacity-50"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
          </button>
        </form>

        <div className="divider my-4 text-xs text-gray-400">অথবা</div>

        <div className="flex gap-3">
         
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="flex-1 btn bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold normal-case shadow-sm flex items-center justify-center gap-2 py-2.5"
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
            className="flex-1 btn bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold normal-case shadow-sm flex items-center justify-center gap-2 py-2.5"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.925-6.435-1.335-5.4-4.8 6.78-4.8 6.78-1.515.105-3.12-.765-3.12-.765-.45-1.515-1.8-2.64-3.3-2.64-1.5 0-2.85.9-3.3 2.64 0 0-1.605-.87-3.12-.765 0 0-3.465 5.16-4.8 6.78-1.35 1.62-.825 3.36-.45 3.795-.375.435-.975 1.08-1.23 1.695-.51.285-1.095 1.35-1.23 1.695-.24.675.54 1.965 4.035 1.41 0 1.005-.015 1.95-.015 2.235 0 .315.225.675.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">অ্যাকাউন্ট নেই? </span>
          <a href="/signup" className="text-[#048848] font-bold hover:underline">
            সাইন আপ করুন
          </a>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
          ← হোম পেজে ফিরে যান
        </a>
      </div>
    </div>
  );
};

export default SignInPage;