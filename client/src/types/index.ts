import { ReactNode } from "react";

export interface ThemeContextType {
  theme: string;
  toggleTheme: (newTheme?: string) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface MenuItem {
  name: string;
  href: string;
  id: string;
}

export interface SocialLink {
  name: string;
  id: string;
  href: string;
  icon: string;
  hoverIcon: string;
}

export interface SocialHelp {
  name: string;
  id: string;
  href: string;
  icon: string;
  hoverIcon: string;
}
