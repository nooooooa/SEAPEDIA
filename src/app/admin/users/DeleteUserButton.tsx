"use client";

import { useRouter } from "next/navigation";

export default function DeleteUserButton({
  userId,
}: {
  userId: number;
}) {
  const router = useRouter();

  const handleDelete = async () => {

    if (!confirm("Delete this user?")) return;

    const res = await fetch(
      `/api/admin/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Delete
    </button>
  );
}