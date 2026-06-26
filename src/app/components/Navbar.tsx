"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#131921] shadow-md">
      <div className="max-w-7xl mx-auto h-16 px-8 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-white text-3xl font-extrabold tracking-wide transition duration-300 hover:text-amber-400"
        >
          SEAPEDIA
        </Link>

        {/* Search */}
        <div className="flex items-center w-[45%]">
          <input
            type="text"
            placeholder="Search products, stores..."
            className="w-full h-11 px-5 rounded-l-full bg-gray-100 outline-none text-black"
          />

          <button
            className="h-11 w-14 rounded-r-full bg-amber-500 hover:bg-amber-600 flex justify-center items-center transition"
          >
            <Search size={20} color="white" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-5">

          <Link
            href="/login"
            className="text-white hover:text-amber-400 transition font-medium"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full transition font-medium"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}