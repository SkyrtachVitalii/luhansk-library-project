import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Історія",
    description: "Історія нашої бібліотеки"
};

export default function HistoryLayout({
    children,
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
};