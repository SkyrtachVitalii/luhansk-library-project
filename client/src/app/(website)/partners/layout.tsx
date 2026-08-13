import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Партнери",
    description: "Наша бібліотека завжди відкрита до співробітництва та втіленню найкреативніших ідей, задумок та проектів. Саме тому, ця сторінка має досить довгий перелік однодумців, завдяки яким у нас все виходить"
};

export default function PartnersLayout({
    children,
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
};