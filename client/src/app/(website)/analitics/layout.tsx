import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Аналітичні матеріали бібліотеки",
    description: "Ознайомтесь з аналітичними матеріалами бібліотеки з моменту заснування"
}

export default function AnaliticsLayout({
    children
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
}