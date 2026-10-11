"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUpdating(true);

    const toastId = toast.loading("প্রোফাইল আপডেট হচ্ছে...");

    const { error } = await authClient.updateUser({
      name: name,
    });

    setUpdating(false);
    toast.dismiss(toastId);

    if (error) {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে!");
      return;
    }

    toast.success("নাম সফলভাবে আপডেট হয়েছে!");

    setTimeout(() => {
      router.refresh();
      window.location.reload();
    }, 1000);
  };

  const handleSignOut = async () => {
    const toastId = toast.loading("লগআউট হচ্ছে...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success("সফলভাবে লগআউট হয়েছে।");
          router.push("/signin");
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
    router.push("/signin");
    return null;
  }

  const userInitial = session.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-[85vh] bg-[#f3f6f3] py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
     
        <div>
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Top Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#048848] text-white flex items-center justify-center text-2xl font-bold">
                {userInitial}
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {session.user?.name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {session.user?.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>↵</span> সাইন আউট
          </button>
        </div>

     
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-4">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-[#048848] hover:bg-[#036c39] text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs disabled:opacity-50 mt-2 cursor-pointer"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}