"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    console.log(result);

    if (!result || result.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/");
    router.refresh();
  };
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#131921] tracking-wide">
            SEAPEDIA
          </h1>

          <p className="mt-3 text-gray-500">
            Welcome back! Sign in to continue shopping.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="text-amber-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          {error && (
            <p className="text-center text-red-500 text-sm">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <div className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-amber-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </div>
        <div className="text-center mb-8">
        <Link
          href="/"
          className="mt-4 inline-block text-gray-500 hover:text-[#131921] transition"
        >
          ← Back to Home
        </Link>
      </div>

      </div>
    </main>
  );
}