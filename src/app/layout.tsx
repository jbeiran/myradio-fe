import type { Metadata } from "next";
import { Princess_Sofia } from "next/font/google";
import { Providers } from "./providers";

const princess = Princess_Sofia({
  weight: "400",
  subsets: ["latin"],
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
    <html lang="es" className={princess.className}>
      <body className={princess.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
