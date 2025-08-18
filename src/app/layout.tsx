import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { Titan_One } from "next/font/google";

const titanOne = Titan_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-titan-one',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Grotte de Juju",
  description: "Ici, tu pourras rester au courant des nouveautés de la chaîne, qu'il s'agisse des dernières vidéos, des créations en cours ou de l'univers qui prend forme peu à peu ! Tu auras même la chance de lire des bandes dessinées mettant en scène tes personnages préférés.",
  metadataBase: new URL("https://la-grotte-de-juju.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "La Grotte de Juju",
    description: "Ici, tu pourras rester au courant des nouveautés de la chaîne, qu'il s'agisse des dernières vidéos, des créations en cours ou de l'univers qui prend forme peu à peu ! Tu auras même la chance de lire des bandes dessinées mettant en scène tes personnages préférés.",
    images: [
      {
        url: "/images/headerfullresV1.webp",
        width: 1200,
        height: 630,
        alt: "La Grotte de Juju",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Grotte de Juju",
    description: "Ici, tu pourras rester au courant des nouveautés de la chaîne, qu'il s'agisse des dernières vidéos, des créations en cours ou de l'univers qui prend forme peu à peu ! Tu auras même la chance de lire des bandes dessinées mettant en scène tes personnages préférés.",
    images: ["/images/headerfullresV1.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${titanOne.variable}`}>
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
