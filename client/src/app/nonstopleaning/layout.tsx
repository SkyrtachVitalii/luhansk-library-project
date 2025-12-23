import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ЛОУНБ | Безперервна освіта",
  description: "Пропонуємо вам навчальні матеріали."
}

export default function NonStopLearningLayout({
    children,
}:{
    children: React.ReactNode;
}) {
    return <>{children}</>
}