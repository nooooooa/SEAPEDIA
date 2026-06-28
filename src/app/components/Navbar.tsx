"use client";

import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { User, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadCartCount() {
      if (!session) return;

      const res = await fetch("/api/cart/count");
      const data = await res.json();

      setCartCount(data.count);
    }

    loadCartCount();
  }, [session]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );
  return (
    <nav className="bg-[#131921] shadow-md">
      <div className="max-w-7xl mx-auto h-16 px-8 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-white text-3xl font-extrabold tracking-wide hover:text-amber-400 transition"
        >
          SEAPEDIA
        </Link>

        {/* Search */}
        <div className="flex items-center w-[45%]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-5 rounded-l-full bg-gray-100 outline-none text-black"
          />

          <button
            onClick={() => {
              if (search.trim() === "") {
                router.push("/");
              } else {
                router.push(`/?search=${encodeURIComponent(search)}`);
              }
            }}
            className="h-11 w-14 rounded-r-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center"
          >
            <Search size={20} color="white" />
          </button>
        </div>

        {/* Right Menu */}
        {!session ? (
          <div className="flex items-center gap-6 text-white">
            <Link
              href="/login"
              className="text-white hover:text-amber-400 transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full transition"
            >
              Register
            </Link>
          </div>
        ) : (
          
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative text-white hover:text-amber-400 transition"
          >
            <ShoppingCart size={24} />

            <span
              className="
                absolute
                -top-2
                -right-2
                bg-amber-500
                text-xs
                text-white
                rounded-full
                w-5
                h-5
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {cartCount}
            </span>
          </Link>

          {/* Profile Dropdown */}
          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-white hover:text-amber-400 transition">
                <User size={20} />

                <span className="font-medium">
                  {session.user?.name}
                </span>

                <ChevronDown size={18} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {session.user?.name}
                  </span>

                  <span className="text-xs text-gray-500">
                    {session.user?.roles?.[0]}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile">
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">
                  Order History
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-500 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>
        )}

      </div>
    </nav>
  );
}