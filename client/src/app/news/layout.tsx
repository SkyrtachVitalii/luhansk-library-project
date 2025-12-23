import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Новини",
    description: "Новини",
}

export default function NewsLayout({
    children,
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
};