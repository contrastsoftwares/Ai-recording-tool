import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Contrast AI.",
    features: [
      "5 recordings per month",
      "Basic AI-generated notes",
      "10 flashcard decks",
      "Community support",
      "1 GB storage",
    ],
    cta: "Get Started",
    href: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/mo",
    description: "Everything you need to ace your classes.",
    features: [
      "Unlimited recordings",
      "Advanced AI notes & summaries",
      "Unlimited flashcard decks",
      "AI Chat with your notes",
      "Practice test generation",
      "Priority support",
      "25 GB storage",
      "Export to PDF & Notion",
    ],
    cta: "Start Free Trial",
    href: "/dashboard",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$19.99",
    period: "/mo per user",
    description: "For study groups and organizations.",
    features: [
      "Everything in Pro",
      "Shared workspaces",
      "Collaborative note editing",
      "Team flashcard decks",
      "Admin dashboard & analytics",
      "SSO & SAML",
      "100 GB storage per user",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start for free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={cn(
                "relative flex flex-col rounded-xl border p-8 transition-all duration-300",
                tier.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/10 scale-[1.02] md:scale-105"
                  : "border-border bg-card hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
              )}
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Tier header */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              {/* Features */}
              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        tier.highlighted ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.href}
                className={cn(
                  "mt-8 inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-all",
                  tier.highlighted
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                    : "border border-border bg-background text-foreground hover:bg-accent hover:-translate-y-0.5"
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
