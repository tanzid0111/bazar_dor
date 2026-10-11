'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';


interface Category {
  id: string;
  slug: string;
  nameBn: string;
}

const NavLinks: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Async function create kore API theke data fetch kora
    const fetchCategories = async (): Promise<void> => {
      try {
        const response = await fetch('https://api.abcz.workers.dev/api/bazardor/categories');
        
        if (!response.ok) {
          throw new Error('Data fetch korte somossa hoyeche');
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (e: React.MouseEvent, categoryPath: string) => {
    e.preventDefault();

    if (!session) {
      toast.error('দয়া করে প্রথমে সাইন ইন করুন!');
      router.push('/signin');
      return;
    }

    router.push(categoryPath);
  };

  if (loading) {
    return <div className="text-center py-2 text-sm text-gray-500">লোডিং...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-2 text-sm">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <nav className="flex items-center justify-start gap-3 overflow-x-auto py-3 no-scrollbar">
        {categories.map((category) => {
          const categoryPath = `/category/${category.slug}`;
          const isActive = pathname === categoryPath;

          return (
            <button
              key={category.id}
              onClick={(e) => handleCategoryClick(e, categoryPath)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {category.nameBn}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default NavLinks;