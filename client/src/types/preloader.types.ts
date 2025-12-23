export interface PreloaderProps {
  isLoading?: boolean;
  minDisplayTime?: number;
  type?: 'full' | 'local';
  className?: string;
  children?: React.ReactNode;
}