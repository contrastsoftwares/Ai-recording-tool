import Link from "next/link";
import { Sparkles, Twitter, Github, Send } from "lucide-react";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#how-it-works", label: "How It Works" },
      { href: "/changelog", label: "Changelog" },
      { href: "/integrations", label: "Integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/press", label: "Press Kit" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/help", label: "Help Center" },
      { href: "/community", label: "Community" },
      { href: "/tutorials", label: "Tutorials" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/security", label: "Security" },
    ],
  },
];

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top section: brand + columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:gap-12">
          {/* Brand + newsletter column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">
                Contrast AI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Turn any lecture into smart notes, flashcards, and study materials
              with the power of AI.
            </p>

            {/* Newsletter signup */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">
                Stay up to date
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 h-px bg-border" />

        {/* Bottom section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Contrast AI. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
