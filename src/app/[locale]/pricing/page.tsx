import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PricingCtaButton } from "@/components/pricing-cta-button";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  ArrowRight,
  Shield,
  Bitcoin,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started. Browse, post, and receive bids.",
    icon: Zap,
    iconBg: "bg-stone-100",
    iconColor: "text-stone-600",
    cta: "Get Started",
    ctaVariant: "outline" as const,
    popular: false,
    features: [
      { text: "Browse all cooks and profiles", included: true },
      { text: "Post cooking events", included: true },
      { text: "Receive bids from cooks", included: true },
      { text: "View cook ratings & reviews", included: true },
      { text: "Direct messaging with cooks", included: false },
      { text: "Priority in search results", included: false },
      { text: "Verified badge", included: false },
    ],
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    description:
      "For food lovers who want the full experience. Message any cook directly.",
    icon: Crown,
    iconBg: "bg-warm-100",
    iconColor: "text-warm-600",
    cta: "Start Premium",
    ctaVariant: "default" as const,
    popular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Direct messaging with any cook", included: true },
      { text: "Priority in search results", included: true },
      { text: "Verified badge on profile", included: true },
      { text: "Early access to new cooks", included: true },
      { text: "Cancel anytime", included: true },
      { text: "Pay with crypto", included: true },
    ],
  },
  {
    name: "Per Contact",
    price: "$3",
    period: "/contact",
    description:
      "Don't need a subscription? Buy individual cook contacts as needed.",
    icon: Sparkles,
    iconBg: "bg-sage-100",
    iconColor: "text-sage-600",
    cta: "Buy Contacts",
    ctaVariant: "outline" as const,
    popular: false,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlock individual cook contacts", included: true },
      { text: "One-time payment per cook", included: true },
      { text: "No subscription needed", included: true },
      { text: "Contact info never expires", included: true },
      { text: "Pay with crypto", included: true },
      { text: "Priority support", included: false },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-50 to-white pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12">
          <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">
            Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-3 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto text-lg">
            Start free. Upgrade when you need direct access to cooks.
            No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl border p-8 transition-all hover:shadow-lg ${
                  plan.popular
                    ? "border-warm-300 shadow-xl shadow-warm-100/50 scale-[1.02]"
                    : "border-stone-100 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-warm-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center mb-4`}
                  >
                    <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold text-stone-900">
                      {plan.price}
                    </span>
                    <span className="text-stone-500 text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* CTA */}
                <PricingCtaButton
                  label={plan.cta}
                  popular={plan.popular}
                  variant={plan.ctaVariant}
                />

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-sage-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-stone-400" />
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-stone-700"
                            : "text-stone-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - Desktop */}
      <section className="py-12 hidden lg:block">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
            Feature Comparison
          </h2>
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left p-4 text-sm font-medium text-stone-500">
                    Feature
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-stone-700">
                    Free
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-warm-700 bg-warm-50/50">
                    Premium
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-stone-700">
                    Per Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Browse cooks & profiles",
                    free: true,
                    premium: true,
                    perContact: true,
                  },
                  {
                    feature: "Post cooking events",
                    free: true,
                    premium: true,
                    perContact: true,
                  },
                  {
                    feature: "Receive bids",
                    free: true,
                    premium: true,
                    perContact: true,
                  },
                  {
                    feature: "View ratings & reviews",
                    free: true,
                    premium: true,
                    perContact: true,
                  },
                  {
                    feature: "Direct messaging",
                    free: false,
                    premium: true,
                    perContact: "Per cook",
                  },
                  {
                    feature: "Priority in search",
                    free: false,
                    premium: true,
                    perContact: false,
                  },
                  {
                    feature: "Verified badge",
                    free: false,
                    premium: true,
                    perContact: false,
                  },
                  {
                    feature: "Early cook access",
                    free: false,
                    premium: true,
                    perContact: false,
                  },
                  {
                    feature: "Crypto payments",
                    free: false,
                    premium: true,
                    perContact: true,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-stone-50 ${
                      i % 2 === 0 ? "bg-stone-50/30" : ""
                    }`}
                  >
                    <td className="p-4 text-sm text-stone-700">
                      {row.feature}
                    </td>
                    <td className="text-center p-4">
                      {row.free === true ? (
                        <Check className="w-4 h-4 text-sage-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-stone-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4 bg-warm-50/30">
                      {row.premium === true ? (
                        <Check className="w-4 h-4 text-warm-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-stone-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row.perContact === true ? (
                        <Check className="w-4 h-4 text-sage-500 mx-auto" />
                      ) : typeof row.perContact === "string" ? (
                        <span className="text-xs text-stone-500">
                          {row.perContact}
                        </span>
                      ) : (
                        <X className="w-4 h-4 text-stone-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Crypto Payment Note */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
              <Bitcoin className="w-7 h-7 text-cream-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Pay with Crypto
            </h3>
            <p className="text-stone-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
              We accept Bitcoin, Ethereum, USDT, and other major
              cryptocurrencies. Pay for your Premium subscription or individual
              contacts with crypto — fast, private, and borderless.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["BTC", "ETH", "USDT", "USDC", "SOL"].map((coin) => (
                <span
                  key={coin}
                  className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10"
                >
                  {coin}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I post events for free?",
                a: "Yes! Posting cooking events and receiving bids from cooks is completely free. You only pay when you want to directly message or contact a cook.",
              },
              {
                q: "What's included in Premium?",
                a: "Premium gives you unlimited direct messaging with all cooks, a verified badge, priority placement in search, and early access to newly joined cooks. It's $12/month and you can cancel anytime.",
              },
              {
                q: "How does Per Contact work?",
                a: "If you don't want a subscription, you can buy individual cook contacts for $3 each. Once purchased, the contact info never expires.",
              },
              {
                q: "Do you really accept crypto?",
                a: "Yes! We support Bitcoin, Ethereum, USDT, USDC, SOL, and more. Crypto payments are processed instantly and you get full access right away.",
              },
              {
                q: "Can I switch between plans?",
                a: "Absolutely. You can upgrade from Free to Premium anytime, or switch to Per Contact payments. Downgrading is instant — no questions asked.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-100 p-5 hover:border-stone-200 transition-colors"
              >
                <h3 className="text-sm font-semibold text-stone-900 mb-2">
                  {item.q}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-warm-700 to-warm-900 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to find your perfect cook?
              </h2>
              <p className="text-warm-200 max-w-md mx-auto mb-6">
                Start for free. Post your first event and let talented cooks come
                to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/events/new">
                  <Button
                    size="lg"
                    className="bg-white text-warm-800 hover:bg-warm-50 rounded-full px-8 text-sm font-semibold shadow-xl"
                  >
                    Post an Event
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/cooks">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-sm font-semibold"
                  >
                    Browse Cooks
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
