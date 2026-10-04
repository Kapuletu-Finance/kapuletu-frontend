import "@/app/globals.css";
import { Figtree, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/features/shared/components/Providers";
import { PublicThemeToggle } from "@/features/shared/components/PublicThemeToggle";
import { SEOConfig } from "@/features/shared/components/SEOConfig";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export { metadataConfig as metadata } from "@/features/shared/components/SEOConfig";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <SEOConfig />
      </head>
      <body className="min-h-full flex flex-col relative">
        <NextTopLoader color="#097255" showSpinner={false} />
        <Providers>
          <PublicThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
