import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error("Gagal mengirim email reset password: " + error.message);
      } else {
        setSent(true);
        toast.success("Email reset password telah dikirim!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

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
            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Lupa <span className="text-gradient">Kata Sandi?</span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Masukkan alamat email Anda dan kami akan mengirimkan link untuk reset kata sandi.
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

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke halaman login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">Email Terkirim!</h2>
                <p className="text-muted-foreground mb-6">
                  Kami telah mengirimkan link reset password ke <span className="font-medium text-foreground">{email}</span>. 
                  Silakan periksa inbox atau folder spam Anda.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="w-full h-12 rounded-xl gap-2"
                  >
                    Kirim Ulang Email
                  </Button>
                  <Link to="/login" className="block">
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2">
                      <ArrowLeft className="w-5 h-5" />
                      Kembali ke Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ForgotPassword;
