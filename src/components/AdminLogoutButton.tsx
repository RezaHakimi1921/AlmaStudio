"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button type="button" className="admin-btn admin-btn--ghost" onClick={logout}>
      خروج
    </button>
  );
}
