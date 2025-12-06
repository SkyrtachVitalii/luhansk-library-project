import Preloader from "@/components/Preloader/Preloader";

export default function Loading() {
  // Тут використовуємо type="full", щоб перекрити весь екран
  return <Preloader type="full" />;
}