import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Shield, CheckCircle, MapPin, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const benefits = [
  "Skrining kesehatan mental gratis",
  "Analisis mendalam dengan AI",
  "Riwayat dan progress tracking",
  "Rekomendasi personalisasi",
  "Akses ke dashboard analitik",
];

const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan",
  "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau",
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten",
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan"
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    region: "",
    terms: false,
    newsletter: false,
  });
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Kata sandi tidak cocok");
      return;
    }

    if (!formData.terms) {
      toast.error("Anda harus menyetujui syarat dan ketentuan");
      return;
    }

    const age = parseInt(formData.age);
    if (formData.age && (isNaN(age) || age < 10 || age > 120)) {
      toast.error("Umur harus antara 10 dan 120 tahun");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName);
      
      // Update profile with age and region after signup
      if (formData.age || formData.region) {
        // Wait a moment for the profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const updateData: { age?: number; region?: string } = {};
          if (formData.age) updateData.age = parseInt(formData.age);
          if (formData.region) updateData.region = formData.region;
          
          await supabase
            .from("profiles")
            .update(updateData)
            .eq("user_id", user.id);
        }
      }
      
      navigate("/screening");
    } catch (error) {
      // Error is handled in AuthContext
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

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword || !formData.confirmPassword;

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
                  Buat Akun <span className="text-gradient">SAPA-JIWA</span>
                </h2>
                <p className="text-muted-foreground">
                  Bergabunglah dengan komunitas kami untuk mulai perjalanan kesehatan mental Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-primary" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border/50 focus:border-primary"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    Alamat Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-border/50 focus:border-primary"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      Umur
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Masukkan umur Anda"
                      value={formData.age}
                      onChange={handleChange}
                      min="10"
                      max="120"
                      className="h-12 rounded-xl border-border/50 focus:border-primary"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      Asal Wilayah
                    </Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, region: value }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="w-4 h-4 text-primary" />
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Buat kata sandi yang kuat"
                      value={formData.password}
                      onChange={handleChange}
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
                  {formData.password && (
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
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi kata sandi Anda"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.terms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, terms: checked as boolean }))
                      }
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      Saya menyetujui{" "}
                      <Link to="#" className="text-primary hover:underline">
                        Syarat & Ketentuan
                      </Link>{" "}
                      dan{" "}
                      <Link to="#" className="text-primary hover:underline">
                        Kebijakan Privasi
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, newsletter: checked as boolean }))
                      }
                    />
                    <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                      Ingin menerima informasi dan update terbaru
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !passwordsMatch || !formData.terms}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>

            {/* Right: Illustration */}
            <div className="hidden lg:flex bg-gradient-to-br from-secondary to-success p-12 text-white flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-6">
                    <UserPlus className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">Mulai Perjalanan Anda</h3>
                  <p className="text-white/80">
                    Dengan mendaftar, Anda mendapatkan akses ke semua fitur SAPA-JIWA
                  </p>
                </div>

                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm flex items-center gap-3">
                  <Shield className="w-8 h-8 flex-shrink-0" />
                  <p className="text-sm">
                    Data Anda aman dengan kami. Semua informasi dienkripsi dan dilindungi.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Register;
