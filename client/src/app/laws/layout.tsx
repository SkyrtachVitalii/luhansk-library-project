import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЛОУНБ | Законодавство",
    description: "У цьому розділі розміщені законодавчі та інструктивні документи, що стосуються діяльності бібліотек України",
}

export default function LawsLayout({
    children
}:{
    children: React.ReactNode;
}){
    return <>{children}</>
}