"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/lib/i18nNavigation";
import { useAuth } from "@/providers/AuthenticationProvider";
import { useLocale, useTranslations } from "next-intl";

export default function DashboardPage() {
  const { logout } = useAuth();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const toggleLocale = () => {
    const nextLocale = currentLocale === "en" ? "es" : "en";
    router.replace(pathname, { locale: nextLocale });
  };
  return (
    <div>
      <p>This is dashboard Admin page</p>
      <div>{t("About.about_paragraph")}</div>
      <Button onClick={toggleLocale}>Change Language</Button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
