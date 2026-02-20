"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What types of content can I upload?",
    answer:
      "You can upload videos, audio files, PDFs, and paste links from YouTube, Vimeo, and other platforms. Our AI processes the content and generates structured notes in your preferred format.",
  },
  {
    question: "How accurate are the AI-generated notes?",
    answer:
      "Our AI is highly accurate and continuously improving. It captures key concepts, definitions, and important details from your lectures. You can always edit and refine the generated notes to match your needs.",
  },
  {
    question: "Can I use Contrast AI for free?",
    answer:
      "Yes! Our Free plan includes 5 recordings per month, basic AI-generated notes, and 10 flashcard decks. It's a great way to try out the platform before upgrading.",
  },
  {
    question: "How does the flashcard generation work?",
    answer:
      "Our AI analyzes your notes and automatically creates question-and-answer flashcard pairs covering the key concepts. You can edit, add, or remove cards and study them with our built-in spaced repetition system.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We use end-to-end encryption for all uploads and notes. Your data is stored securely and never shared with third parties. You can delete your data at any time from your account settings.",
  },
  {
    question: "Can I collaborate with classmates?",
    answer:
      "Yes! With our Team plan, you can create shared workspaces, collaboratively edit notes, and share flashcard decks with your study group. Perfect for group projects and exam prep.",
  },
  {
    question: "What note formats are supported?",
    answer:
      "We support bullet points, Cornell notes, outlines, mind maps, and detailed summaries. You can also customize the format and level of detail to match your study style.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Pro or Team subscription at any time. You'll continue to have access to your plan until the end of your billing period, and your data will always remain accessible.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card transition-all duration-300",
        isOpen && "border-primary/20 shadow-sm"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-sm font-semibold text-foreground">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className="accordion-content"
        style={{ maxHeight: isOpen ? "200px" : "0px" }}
      >
        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const leftColumn = faqs.slice(0, Math.ceil(faqs.length / 2));
  const rightColumn = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Contrast AI.
          </p>
        </div>

        {/* FAQ grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Left column */}
          <div className="space-y-4">
            {leftColumn.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {rightColumn.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
