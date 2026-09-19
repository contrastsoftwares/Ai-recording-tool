import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageSync } from "@/components/layout/language-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Ghost — Your AI Study Companion",
  description:
    "Study Ghost turns your recordings, files, and links into clean, exam-ready study notes, flashcards, and quizzes with AI. Record, transcribe, summarize, and study smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageSync />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
