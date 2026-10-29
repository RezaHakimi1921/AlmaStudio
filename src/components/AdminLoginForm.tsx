"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "ورود ناموفق بود");
        return;
      }
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login glass" onSubmit={onSubmit}>
      <h1 className="admin-login__title">ورود مدیریت</h1>
      <p className="admin-login__lead">
        برای ویرایش هاب و لینک‌های مشتریان وارد شوید.
      </p>
      <label className="admin-login__field">
        نام کاربری
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label className="admin-login__field">
        رمز عبور
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {error ? <p className="admin-error">{error}</p> : null}
      <button className="admin-btn admin-login__submit" type="submit" disabled={loading}>
        {loading ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}
