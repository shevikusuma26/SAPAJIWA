import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Briefcase, Camera, Save, History, Shield, LogOut, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScreeningHistory {
  id: string;
  created_at: string;
  risk_level: string;
  dominant_emotion: string | null;
}

const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan",
  "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau",
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten",
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan"
];

const Profile = () => {
  const { user, profile, loading, signOut, updateProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [screeningHistory, setScreeningHistory] = useState<ScreeningHistory[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "",
    birth_date: "",
    occupation: "",
    region: "",
    age: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        birth_date: profile.birth_date || "",
        occupation: profile.occupation || "",
        region: (profile as any).region || "",
        age: (profile as any).age?.toString() || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("screening_results")
        .select("id, created_at, risk_level, dominant_emotion")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) {
        setScreeningHistory(data);
      }
    };

    fetchHistory();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setUploadingAvatar(true);

    try {
      // Create unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(user.id);
      
      if (existingFiles && existingFiles.length > 0) {
        await supabase.storage
          .from("avatars")
          .remove(existingFiles.map(f => `${user.id}/${f.name}`));
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: `${publicUrl}?t=${Date.now()}` } as any);
      
      toast.success("Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Gagal mengunggah foto profil");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData: any = {
        full_name: formData.full_name,
        phone: formData.phone,
        gender: formData.gender,
        birth_date: formData.birth_date || null,
        occupation: formData.occupation,
        region: formData.region || null,
      };
      
      if (formData.age) {
        updateData.age = parseInt(formData.age);
      }
      
      await updateProfile(updateData);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "tinggi":
        return "bg-destructive/20 text-destructive";
      case "sedang":
        return "bg-warning/20 text-warning";
      default:
        return "bg-success/20 text-success";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-4">
              <User className="w-4 h-4 text-primary" />
              <span>Profil Pengguna</span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Profil <span className="text-gradient">Saya</span>
            </h1>
            <p className="text-muted-foreground">
              Kelola informasi pribadi dan lihat riwayat skrining Anda
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Informasi Pribadi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar"
                            className="w-20 h-20 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                            {formData.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          disabled={uploadingAvatar}
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          {uploadingAvatar ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Camera className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <div>
                        <p className="font-medium">{formData.full_name || "Nama Lengkap"}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">Klik ikon kamera untuk ganti foto</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Nama Lengkap
                        </Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap"
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="h-12 rounded-xl bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Nomor Telepon
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Umur
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Masukkan umur"
                          min="10"
                          max="120"
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birth_date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Tanggal Lahir
                        </Label>
                        <Input
                          id="birth_date"
                          name="birth_date"
                          type="date"
                          value={formData.birth_date}
                          onChange={handleChange}
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Jenis Kelamin
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, gender: value }))
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Laki-laki</SelectItem>
                            <SelectItem value="female">Perempuan</SelectItem>
                            <SelectItem value="other">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Asal Wilayah
                        </Label>
                        <Select
                          value={formData.region}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, region: value }))
                          }
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

                      <div className="space-y-2">
                        <Label htmlFor="occupation" className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Pekerjaan
                        </Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="Masukkan pekerjaan"
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Simpan Perubahan
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSignOut}
                        className="gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Screening History */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Riwayat Skrining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {screeningHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Belum ada riwayat skrining
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {screeningHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getRiskBadgeColor(
                                item.risk_level
                              )}`}
                            >
                              Risiko {item.risk_level}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          {item.dominant_emotion && (
                            <p className="text-xs text-muted-foreground">
                              Emosi dominan: {item.dominant_emotion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Privacy Info */}
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Privasi Anda</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Data Anda dienkripsi dan dilindungi. Kami tidak akan pernah membagikan
                    informasi pribadi Anda kepada pihak ketiga tanpa persetujuan.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
