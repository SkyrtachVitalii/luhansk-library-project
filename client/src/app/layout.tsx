import type { Metadata } from "next";
// import { Roboto } from "next/font/google";
import "./globals.scss";
import LoginModal from "@/components/Auth/LoginModal";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ToTopBtn from "@/components/ToTopBtn/ToTopBtn";
import { ThemeProvider } from "../context/ThemeContext";
// Імпортуємо Redux провайдер (який ми створили раніше)
import StoreProvider from "../lib/redux/StoreProvider"; 

// const roboto = Roboto({
//   weight: ["400", "700"],
//   subsets: ["latin", "cyrillic"],
//   variable: "--font-roboto",
//   display: "swap",
// });

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
    <html lang="uk">
      {/* Клас шрифту додаємо до body */}
      {/* <body className={roboto.className}> */}
      <body>
        {/* Спочатку йде Redux (дані), потім Тема (інтерфейс) */}
        <StoreProvider>
          <ThemeProvider>
            <Header />
            <main className="container">{children}</main>
            <Footer />
            <ToTopBtn />
          </ThemeProvider>
        </StoreProvider>
        <LoginModal />
      </body>
    </html>
  );
}