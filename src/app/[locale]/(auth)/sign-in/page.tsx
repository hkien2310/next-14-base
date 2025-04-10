import { setRequestLocale } from "next-intl/server";
import AuthenticationProvider from "@/providers/AuthenticationProvider";
import PageContent from "./page-content";

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignIn(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  // const t = await getTranslations({
  //   locale,
  // });

  return (
    <div className="component:SignIn">
      <AuthenticationProvider>
        <PageContent />
      </AuthenticationProvider>
    </div>
  );
}
