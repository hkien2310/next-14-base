import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

const nextConfig = {
  experimental: {
    
  },
};

export default withNextIntl(nextConfig);
