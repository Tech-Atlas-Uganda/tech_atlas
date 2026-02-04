import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/AuthDialog";
import { 
  Home, 
  Map, 
  MapPin,
  Briefcase, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  BarChart3,
  Settings,
  LogOut,
  User,
  Users,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/map", label: "Uganda Map", icon: MapPin },
  { href: "/ecosystem", label: "Ecosystem", icon: Map },
  { href: "/profiles", label: "People", icon: Users },
  { href: "/jobs", label: "Jobs & Gigs", icon: Briefcase },
  { href: "/learning", label: "Learning", icon: GraduationCap },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/forum", label: "Forum", icon: Users },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: (typeof window !== 'undefined' && window.innerWidth < 768) 
            ? (isMobileOpen ? 0 : -280) 
            : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/50 z-40 flex flex-col overflow-hidden md:translate-x-0"
      >
          {/* Logo */}
          <div className="p-6 border-b border-slate-800/50">
            <Link href="/">
              <a className="flex items-center gap-3 group" onClick={() => setIsMobileOpen(false)}>
                <img src="/logo.png" alt="Tech Atlas" className="w-10 h-10 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow" />
                <div>
                  <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Tech Atlas</h1>
                  <p className="text-xs text-slate-400">Uganda Ecosystem</p>
                </div>
              </a>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <a onClick={() => setIsMobileOpen(false)}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 rounded-full bg-blue-400"
                        />
                      )}
                    </motion.div>
                  </a>
                </Link>
              );
            })}

            {/* Admin Link */}
            {user?.user_metadata?.role === "admin" && (
              <Link href="/admin">
                <a onClick={() => setIsMobileOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${location === "/admin"
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Admin Panel</span>
                  </motion.div>
                </a>
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800/50">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.user_metadata?.name || user.email?.split('@')[0] || "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile/settings">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMobileOpen(false);
                  }}
                  className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setShowAuthDialog(true);
                  setIsMobileOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </motion.aside>

      {/* Auth Dialog */}
      <AuthDialog
        title="Welcome to Tech Atlas"
        logo="/logo.png"
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
}
