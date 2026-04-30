import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Рекомендуємо",
    description: "Наші рекомендації подій",
};

export default function RecommendsPageLayout({
    children
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
}