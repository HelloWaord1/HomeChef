"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChefHat, LogOut, LayoutDashboard, CalendarDays, User } from "lucide-react";

const navLinks = [
  { href: "/cooks", label: "Browse Cooks" },
  { href: "/dishes", label: "Dishes" },
  { href: "/events", label: "Events" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-cooks", label: "For Cooks" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLoggedIn = status === "authenticated" && session?.user;
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-stone-200/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-warm-500 to-warm-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Free<span className="text-warm-700">Chef</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  link.href === "/post-event"
                    ? "text-warm-700 hover:text-warm-800 hover:bg-warm-50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {userRole === "COOK" && (
                  <Button variant="ghost" size="sm" className="text-stone-600" asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-stone-600" asChild>
                  <Link href="/dashboard/bookings">
                    <CalendarDays className="w-4 h-4 mr-1.5" />
                    Bookings
                  </Link>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-warm-200 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-warm-700" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-stone-700">
                    {session.user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-500 hover:text-stone-700"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-stone-600" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-5"
                  asChild
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-warm-500 to-warm-700 flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-stone-900">
                      Free<span className="text-warm-700">Chef</span>
                    </span>
                  </Link>
                </div>
                <div className="flex flex-col p-4 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isLoggedIn && (
                    <>
                      <Link
                        href="/dashboard/bookings"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                      >
                        My Bookings
                      </Link>
                      {userRole === "COOK" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setOpen(false)}
                          className="px-4 py-3 text-base font-medium text-warm-700 hover:text-warm-800 hover:bg-warm-50 rounded-lg transition-colors"
                        >
                          Cook Dashboard
                        </Link>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-auto p-4 border-t flex flex-col gap-2">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 mb-1">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-warm-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-warm-700" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-stone-900">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs text-stone-500">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                      </Button>
                      <Button className="w-full bg-warm-700 hover:bg-warm-800 text-white" asChild>
                        <Link href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
