import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageSync } from "@/components/layout/language-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contrast AI - Your AI Study Companion",
  description:
    "AI-powered note-taking, lecture recording, and study tool for students and professionals. Record, transcribe, summarize, and generate study materials with AI.",
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
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet" />
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
