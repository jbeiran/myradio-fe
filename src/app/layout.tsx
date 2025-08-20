import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Princess_Sofia } from "next/font/google";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Saki's Pink World - 2000s Vibes",
  description:
    "Mi espacio personal estilo 2000s - Pink vibes, glitter y mucho amor",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>",
  },
};

const princess = Princess_Sofia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-princess",
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={princess.variable}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
