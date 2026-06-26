"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#131921] tracking-wide">
            SEAPEDIA
          </h1>

          <p className="mt-3 text-gray-500">
            Create your account
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>

            <input
              type="password"
              placeholder="Create your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Register
          </button>

        </form>

        <div className="mt-8 text-center text-gray-600">

          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amber-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-gray-500 hover:text-[#131921]"
          >
            ← Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}