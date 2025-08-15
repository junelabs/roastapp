export const dynamic = 'force-dynamic';

export default function PartnersPage() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PARTNER_LINK || '#';

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold">Become an Every Roast Partner</h1>
        <p className="mt-4 text-lg text-neutral-700">
          Get featured across Every Roast for a full year. Drive reviews, reach new customers, and level up your brand trust.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">What you get</h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700 list-disc pl-5">
              <li>Featured placement on homepage (rotating)</li>
              <li>Dedicated partner profile highlights</li>
              <li>QR review cards (first batch included)</li>
              <li>Access to review insights</li>
            </ul>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <p className="mt-4 text-3xl font-semibold">$599<span className="text-base font-normal">/yr</span></p>
            <p className="mt-2 text-sm text-neutral-700">Simple, annual plan. No hidden fees.</p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Get started</h3>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={stripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 hover:bg-neutral-50"
              >
                Pay $599/year (Stripe)
              </a>
              <a
                href="/partners/apply"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 hover:bg-neutral-50"
              >
                Apply & get invoiced
              </a>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Prefer an invoice? Use the apply option and we’ll follow up within 1–2 business days.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-medium">How soon will we be featured?</p>
              <p className="text-sm text-neutral-700">Within 3–5 days of payment or application approval.</p>
            </div>
            <div>
              <p className="font-medium">What are “Verified Roasters”?</p>
              <p className="text-sm text-neutral-700">
                Active roasting operation with traceable sourcing and public sales (online or cafe). One‑liner badge criteria.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
