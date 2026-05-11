import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageCircle, BarChart3, Info, Menu, X, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import sapaJiwaLogo from "@/assets/sapa-jiwa-logo.png";

const navItems = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/screening", label: "Skrining", icon: MessageCircle },
  { path: "/analytics", label: "Analitik", icon: BarChart3 },
  { path: "/about", label: "Tentang", icon: Info },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={sapaJiwaLogo} alt="SAPA-JIWA Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-display font-bold text-gradient">
            SAPA-JIWA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {profile?.full_name || "Profil"}
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 overflow-hidden"
          >
            <div className="container py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Profil
                      </Button>
                    </Link>
                    <Button className="w-full gap-2" variant="destructive" onClick={() => { signOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <LogIn className="w-4 h-4" />
                        Masuk
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary">
                        <UserPlus className="w-4 h-4" />
                        Daftar
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
