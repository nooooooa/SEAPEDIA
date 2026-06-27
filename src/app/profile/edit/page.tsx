"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();

        setUsername(data.username);
        setEmail(data.email);
      } catch (err) {
        setError("Failed to load profile.");
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSuccess(data.message);

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#131921]">
          Edit Profile
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Update your account information.
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-green-100 text-green-700 px-4 py-3">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Username <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email <span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <hr />

          <div>
            <label className="block mb-2 font-medium">
              Current Password <span className="text-red-500">*</span>
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to save changes"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank if you don't want to change it"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/profile"
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}