import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ЛОУНБ | Тренінговий центр",
  description: "Регіональний тренінговий центр (РТЦ) – універсальний інформаційно-навчальний центр Good Library. Його мета – надавати безкоштовні освітні послуги за різними напрямками та пропагувати неформальну освіту серед населення Луганської області, а ще організовувати безперервну бібліотечну освіту для фахівців.",
};

export default function TrainingCenterPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
