import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Heart, History, BarChart2, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/screening");
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl bg-card border border-border/50"
          >
            {/* Left: Form */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold mb-2">
                  Masuk ke <span className="text-gradient">SAPA-JIWA</span>
                </h2>
                <p className="text-muted-foreground">
                  Selamat datang kembali! Masuk untuk melanjutkan perjalanan kesehatan mental Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    Alamat Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-border/50 focus:border-primary"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="w-4 h-4 text-primary" />
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-border/50 focus:border-primary pr-12"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Ingat saya
                    </Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Lupa kata sandi?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Belum punya akun?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>

            {/* Right: Illustration */}
            <div className="hidden lg:flex bg-gradient-to-br from-primary to-secondary p-12 text-white flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">Selamat Datang Kembali</h3>
                  <p className="text-white/80">
                    Lanjutkan perjalanan kesehatan mental Anda dengan akses ke fitur-fitur eksklusif
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: History, label: "Riwayat Skrining" },
                    { icon: BarChart2, label: "Analisis Tren" },
                    { icon: UserCog, label: "Profil Personal" },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
                    >
                      <feature.icon className="w-6 h-6" />
                      <span className="font-medium">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Login;
