import { MenuItem, SocialLink, SocialHelp } from "../types";

// Масив пунктів меню для хедера
export const headerMenuItems: MenuItem[] = [
  { name: "Новини", href: "/news", id: "news" },
  { name: "Пропонуємо", href: "/recommends", id: "recommends" },
  { name: "Календар", href: "/calendar", id: "calendar" },
  { name: "Про бібліотеку", href: "/about", id: "about" },
  { name: "Послуги", href: "/services", id: "services" },
  { name: "Проєкти", href: "/projects", id: "projects" },
  { name: "Стати читачем", href: "/be-reader", id: "be-reader" },
  { name: "Електронний каталог", href: "/e-catalog", id: "e-catalog" },
  { name: "Бібліотекарю", href: "/bibliotekaru", id: "bibliotekaru" },
  { name: "Адмінка", href: "/admin", id: "admin" },
];

// Масив пунктів для посилань на соціальні мережі
export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    id: "facebook",
    href: "https://www.facebook.com/lugbib",
    icon: "/fb.png",
    hoverIcon: "/fbh.png",
  },
  {
    name: "Instagram",
    id: "instagram",
    href: "https://www.instagram.com/lugOUNB",
    icon: "/inst.png",
    hoverIcon: "/insth.png",
  },
  {
    name: "YouTube",
    id: "youtube",
    href: "https://www.youtube.com/channel/UCYuaOohsFuK7yo_OBqcKvtw/featured",
    icon: "/yt.png",
    hoverIcon: "/yth.png",
  },
  {
    name: "Flickr",
    id: "flickr",
    href: "https://www.flickr.com/photos/151497314@N04/albums/with/72157680112113006",
    icon: "/flickr.png",
    hoverIcon: "/flickrh.png",
  },
  {
    name: "Xtwitter",
    id: "xtwitter",
    href: "https://twitter.com/LugOUNB",
    icon: "/xtwitter.png",
    hoverIcon: "/xtwitterh.png",
  },
  {
    name: "Telegram",
    id: "telegram",
    href: "https://t.me/goodlibrary",
    icon: "/tele.png",
    hoverIcon: "/teleh.png",
  },
];

// Масив пунктів для допомоги в соціальних мережах
export const socialHelpLinks: SocialHelp[] = [
  {
    name: "Facebook",
    id: "facebookHelp",
    href: "https://m.me/lugbib",
    icon: "/fb.png",
    hoverIcon: "/fbh.png",
  },
  {
    name: "Telegram",
    id: "telegramHelp",
    href: "https://t.me/Cyberlibrarianbot",
    icon: "/tele.png",
    hoverIcon: "/teleh.png",
  },
  {
    name: "Whatsapp",
    id: "whatsappHelp",
    href: "https://wa.me/380662610598",
    icon: "/whatsapp.png",
    hoverIcon: "/whatsapph.png",
  },
];

// Масив пунктів меню для футера, перший стовпець
export const footerMenuItemsColumn1: MenuItem[] = [
  { name: "Новини", href: "/news", id: "news" },
  { name: "Пропонуємо", href: "/recommends", id: "recommends" },
  { name: "Календар", href: "/calendar", id: "calendar" },
  { name: "Про бібліотеку", href: "/about", id: "about" },
  { name: "Послуги", href: "/services", id: "services" },
  { name: "Стати читачем", href: "/be-reader", id: "be-reader" },
  { name: "Електронний каталог", href: "/e-catalog", id: "e-catalog" },
  { name: "Бібліотекарю", href: "/bibliotekaru", id: "bibliotekaru" },
];

// Масив пунктів меню для футера, другий стовпець
export const footerMenuItemsColumn2: MenuItem[] = [
  { name: "Історія", href: "/history", id: "history" },
  { name: "Проєкти", href: "/projects", id: "projects" },
  { name: "Партнери", href: "/partners", id: "partners" },
  { name: "Звіти", href: "/reports", id: "reports" },
  { name: "Контакти", href: "/contacts", id: "contacts" },
];

// Масив пунктів меню для футера, третій стовпець
export const footerMenuItemsColumn3: MenuItem[] = [
  { name: "Бібліотеки Луганщини", href: "/luglibs", id: "luglibs" },
  { name: "Методична допомога", href: "/methods", id: "methods" },
  { name: "Законодавство", href: "/laws", id: "laws" },
  { name: "Матеріали тренінгів", href: "/trains", id: "trains" },
  { name: "Безперервна освіта", href: "/nonstopleaning", id: "nonstopleaning" },
  { name: "Аналітика", href: "/analitics", id: "analitics" },
  { name: "Луганське відділення УБА", href: "/lula", id: "lula" },
];
