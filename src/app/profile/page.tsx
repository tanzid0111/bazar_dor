"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    const toastId = toast.loading("লগআউট হচ্ছে...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success("সফলভাবে লগআউট হয়েছে।");
          setTimeout(() => {
            router.push("/signin");
          }, 1000);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error("লগআউট ব্যর্থ হয়েছে!");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-[#048848]"></span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const name = session.user?.name || "";
  const email = session.user?.email || "";
  const userInitial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-[85vh] bg-[#f3f6f3] flex justify-center items-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-xl">
        <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-[#048848] text-white flex items-center justify-center text-3xl font-bold shadow-xs">
            {userInitial}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                ✓ সক্রিয় অ্যাকাউন্ট
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400">পুরো নাম</label>
            <input
              type="text"
              value={name}
              disabled
              className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400">ইমেইল ঠিকানা</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/update-profile"
              className="flex-1 bg-[#048848] hover:bg-[#036c39] text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs text-center"
            >
              তথ্য আপডেট করুন <span>›</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              সাইন আউট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}