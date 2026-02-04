import { Button } from "@/components/ui/button";
import { ComingSoonButton } from "@/components/coming-soon-button";
import Image from "next/image";
import {
  ChefHat,
  DollarSign,
  Clock,
  Users,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Set Your Own Prices",
    description:
      "You decide what your food is worth. No pressure, no algorithms — just fair pricing for your craft.",
  },
  {
    icon: Clock,
    title: "Cook on Your Schedule",
    description:
      "Choose when you're available. Cook full-time or just weekends — it's completely up to you.",
  },
  {
    icon: Users,
    title: "Build Your Following",
    description:
      "Create your own brand. Loyal customers keep coming back, and our platform helps you grow.",
  },
  {
    icon: Shield,
    title: "Insurance & Support",
    description:
      "We provide liability insurance, food safety training, and 24/7 cook support. You're never alone.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Start from your kitchen and grow at your pace. Many of our cooks have turned their passion into full-time careers.",
  },
  {
    icon: Star,
    title: "Get Recognized",
    description:
      "Verified badges, featured placements, and a review system that rewards quality. Your talent gets the spotlight.",
  },
];

const steps = [
  {
    num: "01",
    title: "Apply",
    description:
      "Tell us about yourself and your cooking. Share your story, your cuisine, and what makes your food special.",
  },
  {
    num: "02",
    title: "Get Verified",
    description:
      "Complete a food safety certification and a quick kitchen review. We make this simple and free.",
  },
  {
    num: "03",
    title: "Create Your Menu",
    description:
      "Upload photos, set prices, and describe your dishes. We'll help you make your profile shine.",
  },
  {
    num: "04",
    title: "Start Cooking",
    description:
      "Go live and start receiving orders from food lovers in your neighborhood. Welcome to HomeChef!",
  },
];

const testimonials = [
  {
    quote:
      "HomeChef changed my life. I went from cooking for family to having a thriving business from my kitchen. I earn more than my old office job, and I love every minute.",
    author: "Nino K.",
    role: "Georgian cook, Brooklyn",
    avatar:
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100&h=100&fit=crop&crop=face",
    earnings: "$4,200/mo",
  },
  {
    quote:
      "The flexibility is unmatched. I cook when my kids are at school, and I've built a loyal customer base that orders every week. It feels like feeding extended family.",
    author: "Priya S.",
    role: "Indian cook, Jackson Heights",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
    earnings: "$3,800/mo",
  },
];

export default function ForCooksPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-cream-50 to-sage-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 text-sage-700 text-xs font-medium mb-6">
                <ChefHat className="w-3.5 h-3.5" />
                For Home Cooks
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-6">
                Turn your passion
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-800">
                  into income
                </span>
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
                Share your cooking with your community. Set your own hours, your
                own prices, and build a loyal following of food lovers who
                appreciate real food.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <ComingSoonButton
                  size="lg"
                  className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-8 text-sm font-semibold shadow-lg shadow-warm-700/20"
                >
                  Apply to Cook
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ComingSoonButton>
                <ComingSoonButton
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-sm border-stone-300"
                >
                  Learn More
                </ComingSoonButton>
              </div>

              <div className="mt-10 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-stone-900">$3,500</p>
                  <p className="text-xs text-stone-500">Avg. monthly earnings</p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div>
                  <p className="text-2xl font-bold text-stone-900">10K+</p>
                  <p className="text-xs text-stone-500">Active cooks</p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div>
                  <p className="text-2xl font-bold text-stone-900">4.8★</p>
                  <p className="text-xs text-stone-500">Cook satisfaction</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10">
                  <Image
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=700&fit=crop"
                    alt="Home cook preparing food"
                    width={600}
                    height={700}
                    className="w-full object-cover"
                  />
                </div>
                {/* Floating earnings card */}
                <div className="absolute -left-6 bottom-12 bg-white rounded-xl shadow-xl p-4 max-w-[200px]">
                  <p className="text-xs text-stone-500 mb-1">This week</p>
                  <p className="text-2xl font-bold text-sage-700">$847</p>
                  <p className="text-xs text-sage-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">
              Why Cook with Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              We handle the platform, payments, and logistics. You focus on what
              you do best — cooking amazing food.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-stone-100 hover:border-warm-200 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-warm-100 text-warm-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">
              Getting Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3 mb-4">
              Four simple steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <span className="text-6xl font-black text-warm-100">
                  {step.num}
                </span>
                <h3 className="text-lg font-semibold text-stone-900 -mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
              Hear from our cooks
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-cream-50 rounded-2xl p-8 border border-cream-200"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-stone-700 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={t.avatar}
                        alt={t.author}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {t.author}
                      </p>
                      <p className="text-xs text-stone-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="bg-sage-100 text-sage-700 font-bold text-sm px-3 py-1 rounded-full">
                    {t.earnings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-sage-700 to-sage-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to start cooking?
          </h2>
          <p className="text-sage-200 text-lg mb-8">
            Join thousands of home cooks who are sharing their passion and
            earning on their own terms.
          </p>
          <ComingSoonButton
            size="lg"
            className="bg-white text-sage-800 hover:bg-sage-50 rounded-full px-8 text-sm font-semibold shadow-xl"
          >
            Apply Now — It&apos;s Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </ComingSoonButton>
          <p className="text-xs text-sage-400 mt-4">
            Free to join. No commitments. Start when you&apos;re ready.
          </p>
        </div>
      </section>
    </div>
  );
}
