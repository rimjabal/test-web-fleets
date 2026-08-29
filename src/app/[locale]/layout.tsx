import { QueryProvider } from "@/lib/query-provider";
import { type NextLayoutIntlayer } from "next-intlayer";
import { IntlayerProvider } from "next-intlayer/server";
import { Inter } from "next/font/google";
import { getHTMLTextDir } from "intlayer";

import { DynamicBackground } from "@/components/background";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export { generateStaticParams } from "next-intlayer";

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      dir={getHTMLTextDir(locale)}
      className={`${inter.variable} h-full antialiased`}
      data-glassmorphism="dark"
    >
      <body className="min-h-full flex flex-col">
        <IntlayerProvider locale={locale}>
          <QueryProvider>
            <DynamicBackground />
            <div id="app-root" className="flex min-h-full flex-1 flex-col">
              {children}
            </div>
          </QueryProvider>
        </IntlayerProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;