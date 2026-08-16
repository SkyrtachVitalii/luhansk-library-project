// client/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "@/app/globals.scss"; // Твої глобальні стилі
import Providers from "@/lib/redux/StoreProvider"; // Твій Redux Provider
import { ThemeProvider } from "@/components/theme-provider";
import LoginModal from "@/components/Auth/LoginModal";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Luhansk Library",
  description: "Library portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="font-sans antialiased">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
        <LoginModal />
      </body>
    </html>
  );
}
