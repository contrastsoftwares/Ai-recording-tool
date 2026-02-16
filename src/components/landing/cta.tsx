import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-violet px-6 py-16 text-center shadow-2xl shadow-primary/20 sm:px-16 sm:py-24">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Transform How You Study?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
              Join thousands of students and professionals using Contrast AI to
              save time and learn more effectively.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex h-13 items-center justify-center rounded-lg bg-white px-10 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <p className="text-sm text-white/60">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
