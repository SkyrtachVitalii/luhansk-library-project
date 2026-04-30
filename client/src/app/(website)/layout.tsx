// client/src/app/%28website%29/layout.tsx
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper"> 
      <Header />
      {/* 👇 Цей клас container обмежує ширину контенту на сайті */}
      <main className="container">
        {children}
      </main>
      <Footer />
    </div>
  );
}