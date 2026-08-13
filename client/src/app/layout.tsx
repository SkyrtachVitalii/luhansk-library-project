// client/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.scss"; // Твої глобальні стилі
import Providers from "@/lib/redux/StoreProvider"; // Твій Redux Provider
import { ThemeProvider } from "@/context/ThemeContext";
import LoginModal from "@/components/Auth/LoginModal";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

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
    <html lang="uk">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
        <LoginModal />
      </body>
    </html>
  );
}
