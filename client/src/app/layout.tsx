import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ToTopBtn from "@/components/ToTopBtn/ToTopBtn";
import { ThemeProvider } from "../context/ThemeContext";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ЛОУНБ",
  description:
    "Офіційний сайт Луганської обласної універсальної наукової бібліотеки",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${roboto.variable}`}>
      <ThemeProvider>
        <body>
          <Header />
          <main className="container">{children}</main>
          <Footer/>
          <ToTopBtn />
        </body>
      </ThemeProvider>
    </html>
  );
}
