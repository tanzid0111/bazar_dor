"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavLinks from "./NavLinks";
import Marquee from "./Marquee";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  const isSignInActive = pathname === "/signin";
  const isSignUpActive = pathname === "/signup";

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

  return (
    <div className="bg-base-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="p-2 bg-[#058c42] rounded-2xl flex items-center justify-center shadow-xs">
            <Image src="/logo-icon.png" alt="Logo" width={32} height={32} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-emerald-600">বাজার দর</span>
            <span className="text-xs text-neutral-500">{date}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
         
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost rounded-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 border border-transparent"
              >
                
                <div className="w-8 h-8 rounded-full bg-[#058c42] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {session.user?.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

               
                <span className="text-sm font-semibold text-gray-800">
                  {session.user?.name}
                </span>

                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-lg bg-white rounded-2xl w-60 border border-gray-100"
              >
                <li className="mb-2 pb-2 border-b border-gray-100">
                  <div className="flex flex-col items-start gap-0 hover:bg-transparent cursor-default">
                    <span className="font-bold text-gray-900">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {session.user?.email}
                    </span>
                  </div>
                </li>
                <li>
                  <Link href="/profile" className="py-2 text-gray-700">
                    আমার প্রোফাইল
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="py-2 text-red-600 font-semibold cursor-pointer"
                  >
                    সাইন আউট
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            
            <>
              <Link
                href="/signin"
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                  isSignInActive
                    ? "bg-[#058c42] text-white shadow-xs"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                }`}
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                  isSignUpActive
                    ? "bg-[#058c42] text-white shadow-xs"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                }`}
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <NavLinks />
      <Marquee />
    </div>
  );
};

export default Navbar;