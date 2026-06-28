import "@/app/globals.css";
import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import { Providers } from "@/features/shared/components/Providers";
import { PublicThemeToggle } from "@/features/shared/components/PublicThemeToggle";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "The app for chamas",
  title: "Kapuletu",
};

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
      <body className="min-h-full flex flex-col relative">
        <Providers>
          <PublicThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
