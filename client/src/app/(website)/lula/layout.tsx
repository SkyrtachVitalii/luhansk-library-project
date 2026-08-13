import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Луганське обласне відділення ВГО Українська бібліотечна асоціація",
    description: "Загальна інформація про Луганське обласне відділення ВГО Українська бібліотечна асоціація",
}

export default function LulaLayout({
    children
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
}