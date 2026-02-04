import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Globe,
  Users,
  Sprout,
  ArrowRight,
  ChefHat,
  Quote,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Food is Love",
    description:
      "Every culture expresses love through food. A grandmother's recipe, a father's secret sauce, a friend's birthday cake — food connects us in ways nothing else can.",
  },
  {
    icon: Globe,
    title: "Every Kitchen Tells a Story",
    description:
      "Behind every dish is a journey — from Tbilisi to Tokyo, from Oaxaca to Naples. We celebrate the diversity of world cuisines and the people who keep traditions alive.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We believe in building real connections between neighbors. When you order from a HomeChef cook, you're not just buying food — you're supporting a person and their dream.",
  },
  {
    icon: Sprout,
    title: "Sustainable & Local",
    description:
      "Home cooking means less packaging, less food waste, and shorter delivery distances. It's better for communities and better for the planet.",
  },
];

const stats = [
  { value: "10K+", label: "Home cooks" },
  { value: "50K+", label: "Meals delivered" },
  { value: "200+", label: "Cuisines" },
  { value: "4.8", label: "Avg. rating" },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-100 text-warm-700 text-xs font-medium mb-6">
            <ChefHat className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-6">
            The homemade food
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-600 to-warm-800">
              revolution
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-500 leading-relaxed max-w-2xl mx-auto">
            We started HomeChef with a simple belief: the best food in the
            world isn&apos;t in restaurants — it&apos;s in people&apos;s homes.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-warm-50 rounded-3xl p-8 sm:p-12 border border-warm-100">
            <Quote className="w-10 h-10 text-warm-200 mb-4" />
            <blockquote className="text-xl sm:text-2xl font-medium text-stone-800 leading-relaxed mb-6">
              We grew up eating our grandmothers&apos; food and wondering why
              nothing in restaurants tasted quite the same. Then we realized —
              the magic was never just in the recipe. It was in the love, the
              stories, the kitchen where someone cooked just for you.
            </blockquote>
            <p className="text-sm text-stone-500">
              — The HomeChef Team
            </p>
          </div>
        </div>
      </section>

      {/* Mission Image Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3 mb-6">
                Making the world&apos;s best food accessible to everyone
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The restaurant industry is broken. Middlemen take huge cuts.
                  Talented cooks can&apos;t afford commercial kitchens. And
                  consumers are stuck choosing between overpriced delivery apps
                  and fast food.
                </p>
                <p>
                  HomeChef flips the script. We connect home cooks directly with
                  food lovers in their neighborhood. No commercial kitchen
                  required. No 30% platform fees. Just real people making real
                  food.
                </p>
                <p>
                  We imagine a world where a grandmother from Georgia can share
                  her khinkali with someone in Brooklyn. Where a retired chef
                  from Lyon can make coq au vin for his neighbors. Where food
                  becomes a bridge between cultures, not a commodity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop"
                    alt="Home cooking"
                    width={400}
                    height={500}
                    className="w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop"
                    alt="Fresh ingredients"
                    width={400}
                    height={300}
                    className="w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&h=350&fit=crop"
                    alt="Cooking together"
                    width={400}
                    height={350}
                    className="w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=400&h=400&fit=crop"
                    alt="Sharing food"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-stone-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-stone-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-warm-600 uppercase">
              What We Believe
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3">
              Our values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-warm-100 text-warm-600 flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6">
            Join the movement
          </h2>
          <p className="text-stone-500 text-lg mb-8 max-w-xl mx-auto">
            Whether you&apos;re a food lover looking for authentic meals or a
            cook ready to share your talent — there&apos;s a place for you at
            HomeChef.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cooks">
              <Button
                size="lg"
                className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-8 text-sm font-semibold"
              >
                Explore Cooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/for-cooks">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-sm border-stone-300"
              >
                Become a Cook
                <ChefHat className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
