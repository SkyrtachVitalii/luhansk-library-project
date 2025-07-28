import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";
import Header from "../components/Header/Header";

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ЛОУНБ",
  description: "Офіційний сайт Луганської обласної універсальної наукової бібліотеки",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${roboto.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
