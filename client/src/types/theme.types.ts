import { ReactNode } from "react";

export interface ThemeContextType {
  theme: string;
  toggleTheme: (newTheme?: string) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}