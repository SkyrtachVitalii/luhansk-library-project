import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Бібліотеки Луганщини",
    description: "Представлений довідник дозволить вам скласти уяву про мережу бібліотек регіону, знайти їх контакти та отримати коротку довідку про поточний стан роботи кожної бібліотеки. ",
}

export default function LubligsLayout({
    children
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
}