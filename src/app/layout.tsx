import type { Metadata } from "next";
import { Princess_Sofia, EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";

const princess = Princess_Sofia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-princess",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const cutie = localFont({
  src: "../../public/assets/fonts/CutiePop.ttf",
  variable: "--font-cutie",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saki's Pink World - 2000s Vibes",
  description:
    "Mi espacio personal estilo 2000s - Pink vibes, glitter y mucho amor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${princess.variable} ${garamond.variable} ${cutie.variable}`}
    >
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
