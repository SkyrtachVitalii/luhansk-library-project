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

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}