import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ЛОУНБ | Публікації",
  description: "Публікації бібліотеки",
};

export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
