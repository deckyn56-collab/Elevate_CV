import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --- METADATA HARUS BERADA DI PALING ATAS (SEBELUM FONT) ---
export const metadata: Metadata = {
  title: "LamaranAI - Buat Surat Lamaran & CV ATS Instan",
  description: "Platform AI profesional untuk membuat surat lamaran kerja, analisis skor ATS, dan simulasi wawancara dengan metode STAR secara instan.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* --- FAVICON ANDA (SUDAH ADA) --- */}
        <link rel="icon" href="/favicon.png" />

        {/* --- TEMPELKAN KODE GOOGLE ANALYTICS DI SINI --- */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-20YRTQNM80"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-20YRTQNM80');
            `
          }}
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
