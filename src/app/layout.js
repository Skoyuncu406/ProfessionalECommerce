import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserSync from "@/components/UserSync";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
  title: "VERITAS | Premium Erkek Giyim",
  description:
    "Premium erkek giyim koleksiyonları, şık tasarım, güvenli sipariş ve hızlı alışveriş deneyimi.",
  keywords: [
    "erkek giyim",
    "premium erkek giyim",
    "takım elbise",
    "gömlek",
    "pantolon",
    "aksesuar",
    "VERITAS",
  ],
  openGraph: {
    title: "VERITAS | Premium Erkek Giyim",
    description:
      "Zamansız şıklık için premium erkek giyim koleksiyonlarını keşfedin.",
    type: "website",
    locale: "tr_TR",
    siteName: "VERITAS",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <LanguageProvider>
          <UserSync />
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
