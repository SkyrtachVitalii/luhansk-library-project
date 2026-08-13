import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ЛОУНБ | Контакти",
  description: "Контакти бібліотеки є на кожній сторінці сайту — можна писати, дзвонити, шукати нас в інтернеті або приходити в гості (трохи далеченько, але знайти нас реально). Також ми на зв’язку через Telegram-бота, Instagram та Facebook. А щоб вам було зручніше зрозуміти, до кого звертатися з різних питань — знайомтеся з командою Good Library."
}

export default function ContactsLayout({
    children,
}:{
    children: React.ReactNode;
}) {
    return <>{children}</>
}