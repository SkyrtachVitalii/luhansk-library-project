import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ЛОУНБ | Послуги",
  description: "Послуги бібліотеки",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
