import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/ui/page-transition";

const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MEMFA Jeunesse | Gestion d'Activités",
  description: "Système de gestion et suivi des activités spirituelles de la jeunesse MEMFA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={fontSans.variable}>
      <body className="min-h-screen bg-background text-foreground">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}