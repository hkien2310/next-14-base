import { routing } from "@/lib/i18nNavigation";
import en from "@/locales/en.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en;
    Locale: (typeof routing.locales)[number];
  }
}
