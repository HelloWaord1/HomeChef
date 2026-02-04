import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-warm-500 to-warm-700 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Home<span className="text-warm-400">Chef</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              Connecting home cooks with food lovers. Real meals, real people,
              real neighborhoods.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/cooks"
                  className="text-sm hover:text-white transition-colors"
                >
                  Browse Cooks
                </Link>
              </li>
              <li>
                <Link
                  href="/dishes"
                  className="text-sm hover:text-white transition-colors"
                >
                  Browse Dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm hover:text-white transition-colors"
                >
                  Cooking Events
                </Link>
              </li>
              <li>
                <Link
                  href="/for-cooks"
                  className="text-sm hover:text-white transition-colors"
                >
                  Become a Cook
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <span className="text-sm text-stone-600 cursor-default">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-stone-600 cursor-default">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-sm text-stone-600 cursor-default">
                  Safety
                </span>
              </li>
              <li>
                <span className="text-sm text-stone-600 cursor-default">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-stone-600 cursor-default">
                  Privacy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © 2025 FreeChef. All rights reserved.
          </p>
          <p className="text-xs text-stone-600">
            Made with 🧡 for home cooks everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
