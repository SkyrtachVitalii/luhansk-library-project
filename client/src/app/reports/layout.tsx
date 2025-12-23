import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ЛОУНБ | Плани та звіти",
  description: "Плани та звіти бібліотеки",
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
