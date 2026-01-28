import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Menu, X, MapPin, Briefcase, BookOpen, Calendar, FileText, User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/ecosystem", label: "Ecosystem", icon: MapPin },
    { href: "/jobs", label: "Jobs & Gigs", icon: Briefcase },
    { href: "/learning", label: "Learning", icon: BookOpen },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/blog", label: "Blog", icon: FileText },
  ];

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-smooth">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2 font-bold text-xl text-primary hover:opacity-80 transition-smooth">
              <span className="font-['Space_Grotesk']">Tech Atlas</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-smooth"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu */}
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hidden md:flex">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <a className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      {(user.role === "admin" || user.role === "moderator") && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <a className="flex items-center w-full">
                              <FileText className="mr-2 h-4 w-4" />
                              Admin Panel
                            </a>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild className="hidden md:flex">
                    <a href={getLoginUrl()}>Sign In</a>
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/40">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                </Link>
              );
            })}
            
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <>
                    <Link href="/profile">
                      <a
                        className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-smooth"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </Link>
                    {(user.role === "admin" || user.role === "moderator") && (
                      <Link href="/admin">
                        <a
                          className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-smooth"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </a>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-smooth w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <a href={getLoginUrl()}>Sign In</a>
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
