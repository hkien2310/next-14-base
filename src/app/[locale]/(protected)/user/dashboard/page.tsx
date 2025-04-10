"use client";
import { useAuth } from "@/providers/AuthenticationProvider";

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div>
      <p>This is dashboard User page</p>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
