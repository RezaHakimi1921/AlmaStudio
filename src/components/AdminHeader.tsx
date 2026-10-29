import Link from "next/link";
import { AlmaAppleLogo } from "./AlmaAppleLogo";

export function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="admin-header">
      <Link href="/admin" className="admin-btn admin-btn--ghost">
        بازگشت به پنل
      </Link>
      <div className="admin-header__title">
        <AlmaAppleLogo size={32} />
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}
