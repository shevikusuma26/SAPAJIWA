import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have access_token in the URL (from email link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    
    if (!accessToken) {
      toast.error("Link reset password tidak valid atau sudah kadaluarsa");
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Kata sandi tidak cocok");
      return;
    }

    if (password.length < 6) {
      toast.error("Kata sandi minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error("Gagal mengubah kata sandi: " + error.message);
      } else {
        setSuccess(true);
        toast.success("Kata sandi berhasil diubah!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "Masukkan kata sandi", color: "" };
    if (password.length < 6) return { strength: 25, label: "Lemah", color: "bg-destructive" };
    if (password.length < 8) return { strength: 50, label: "Sedang", color: "bg-warning" };
    if (password.length < 12) return { strength: 75, label: "Kuat", color: "bg-success" };
    return { strength: 100, label: "Sangat Kuat", color: "bg-success" };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword || !confirmPassword;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container py-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-card border border-border/50 p-8">
            {!success ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Reset <span className="text-gradient">Kata Sandi</span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Buat kata sandi baru untuk akun Anda.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="w-4 h-4 text-primary" />
                      Kata Sandi Baru
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Buat kata sandi baru"
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
                    {password && (
                      <div className="space-y-1">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Kekuatan kata sandi: {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="w-4 h-4 text-primary" />
                      Konfirmasi Kata Sandi
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi kata sandi baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`h-12 rounded-xl border-border/50 focus:border-primary pr-12 ${
                          !passwordsMatch ? "border-destructive" : ""
                        }`}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {!passwordsMatch && (
                      <p className="text-xs text-destructive">Kata sandi tidak cocok</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !passwordsMatch}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    {loading ? "Memproses..." : "Simpan Kata Sandi Baru"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">Berhasil!</h2>
                <p className="text-muted-foreground mb-6">
                  Kata sandi Anda telah diubah. Silakan login dengan kata sandi baru Anda.
                </p>
                <Link to="/login">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ResetPassword;
