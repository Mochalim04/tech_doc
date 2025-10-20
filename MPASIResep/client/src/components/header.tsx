import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Home, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", label: "Beranda", icon: Home, testId: "link-home" },
    { path: "/cari-resep", label: "Cari Resep", icon: Search, testId: "link-search" },
    { path: "/favorit", label: "Favorit", icon: Heart, testId: "link-favorites" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover-elevate rounded-lg px-3 py-2 -ml-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">M</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                MPASI Pintar
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={item.testId}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="h-11 px-6 gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-11 w-11"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`${item.testId}-mobile`}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full h-12 justify-start gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
