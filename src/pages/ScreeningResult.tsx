import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Download,
  BarChart3,
  Heart,
  Brain,
  RefreshCcw,
  Shield,
  Phone,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EmotionAnalytics } from "@/components/screening/EmotionAnalytics";
import { ProgressTracking } from "@/components/screening/ProgressTracking";
import { MultidimensionalRiskScore } from "@/components/screening/MultidimensionalRiskScore";
import { TemporalEmotionTrend } from "@/components/screening/TemporalEmotionTrend";
import { generateScreeningPDF } from "@/utils/pdfExport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ScreeningResult {
  id: string;
  risk_level: string;
  confidence: number | null;
  sentiment_score: number | null;
  dominant_emotion: string | null;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
  }> | null;
  created_at: string;
  responses: unknown;
  screening_type: string;
  user_id: string | null;
  is_anonymous: boolean | null;
  session_token: string | null;
}

const getScreeningTypeLabel = (type: string) => {
  switch (type) {
    case "phq9":
      return "PHQ-9 (Skrining Depresi)";
    case "gad7":
      return "GAD-7 (Skrining Kecemasan)";
    case "chat":
      return "Chat AI";
    default:
      return "Skrining Umum";
  }
};

const ScreeningResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [history, setHistory] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/screening");
        return;
      }

      // Get session token from localStorage for anonymous access
      const storedSessionToken = localStorage.getItem(`screening_token_${id}`);

      // First try to fetch if user is authenticated and owns the result
      let data = null;
      let error = null;

      if (user) {
        // Authenticated user - RLS will handle access control
        const result = await supabase
          .from("screening_results")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }

      // If no data found and we have a session token, try anonymous access
      if (!data && storedSessionToken) {
        // For anonymous results, verify the session token matches
        const anonResult = await supabase
          .from("screening_results")
          .select("*")
          .eq("id", id)
          .eq("session_token", storedSessionToken)
          .eq("is_anonymous", true)
          .maybeSingle();
        
        if (anonResult.data) {
          data = anonResult.data;
          error = anonResult.error;
        }
      }

      if (error) {
        console.error("Error fetching screening result:", error);
        toast.error("Gagal memuat hasil skrining");
        navigate("/screening");
        return;
      }

      if (!data) {
        toast.error("Hasil skrining tidak ditemukan atau Anda tidak memiliki akses");
        navigate("/screening");
        return;
      }

      // Additional ownership verification
      if (data.user_id && user && data.user_id !== user.id) {
        toast.error("Anda tidak memiliki akses ke hasil skrining ini");
        navigate("/screening");
        return;
      }

      // For anonymous results without a valid session token, deny access
      if (data.is_anonymous && !data.user_id && !storedSessionToken) {
        toast.error("Anda tidak memiliki akses ke hasil skrining ini");
        navigate("/screening");
        return;
      }

      // Validate required fields
      if (!data.risk_level) {
        console.error("Invalid screening result: missing risk_level");
        toast.error("Data hasil skrining tidak valid");
        navigate("/screening");
        return;
      }

      setResult({
        ...data,
        recommendations: (data.recommendations as ScreeningResult["recommendations"]) || [],
        responses: data.responses || [],
        user_id: data.user_id,
        is_anonymous: data.is_anonymous,
        session_token: data.session_token,
      });

      // Fetch history for progress tracking (only for authenticated users)
      if (user) {
        const { data: historyData } = await supabase
          .from("screening_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30);

        if (historyData) {
          setHistory(historyData.map(h => ({
            ...h,
            recommendations: h.recommendations as ScreeningResult["recommendations"],
            responses: h.responses as ScreeningResult["responses"],
            user_id: h.user_id,
            is_anonymous: h.is_anonymous,
            session_token: h.session_token,
          })));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, navigate, user]);

  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      await generateScreeningPDF(result);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const getRiskConfig = (level: string) => {
    switch (level) {
      case "tinggi":
        return {
          bgClass: "bg-destructive/10 border-destructive/30",
          icon: AlertTriangle,
          label: "Risiko Tinggi",
          message: "Kami sangat menyarankan Anda untuk segera berkonsultasi dengan profesional kesehatan mental.",
          progress: 90,
        };
      case "sedang":
        return {
          bgClass: "bg-warning/10 border-warning/30",
          icon: Info,
          label: "Risiko Sedang",
          message: "Pertimbangkan untuk berbicara dengan konselor atau psikolog untuk mendapatkan dukungan.",
          progress: 60,
        };
      default:
        return {
          bgClass: "bg-success/10 border-success/30",
          icon: CheckCircle,
          label: "Risiko Rendah",
          message: "Kondisi Anda tampak baik. Terus jaga kesehatan mental dengan aktivitas positif.",
          progress: 30,
        };
    }
  };

  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      happiness: "Kebahagiaan",
      sadness: "Kesedihan",
      anxiety: "Kecemasan",
      anger: "Kemarahan",
      fear: "Ketakutan",
      neutral: "Netral",
      hopeful: "Penuh Harapan",
      stressed: "Stres",
    };
    return labels[emotion] || emotion;
  };

  // Generate mock emotion data from dominant emotion
  const generateEmotionData = () => {
    const base = { happiness: 0.1, sadness: 0.1, anxiety: 0.1, anger: 0.05, fear: 0.05, hopeful: 0.1, stressed: 0.1, neutral: 0.4 };
    if (result?.dominant_emotion && base[result.dominant_emotion as keyof typeof base] !== undefined) {
      base[result.dominant_emotion as keyof typeof base] = 0.6;
      base.neutral = 0.1;
    }
    return base;
  };

  const generateRiskIndicators = () => {
    const indicators = [
      { type: "Kesedihan", level: result?.dominant_emotion === "sadness" ? "high" : "low", description: "Tingkat kesedihan terdeteksi", score: result?.dominant_emotion === "sadness" ? 75 : 20 },
      { type: "Kecemasan", level: result?.dominant_emotion === "anxiety" ? "high" : "low", description: "Tingkat kecemasan terdeteksi", score: result?.dominant_emotion === "anxiety" ? 70 : 25 },
      { type: "Stres", level: result?.dominant_emotion === "stressed" ? "medium" : "low", description: "Tingkat stres terdeteksi", score: result?.dominant_emotion === "stressed" ? 55 : 30 },
    ];
    return indicators as Array<{ type: string; level: "low" | "medium" | "high"; description: string; score: number }>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat hasil skrining...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result) return null;

  const riskConfig = getRiskConfig(result.risk_level);
  const RiskIcon = riskConfig.icon;
  const sentimentPercent = result.sentiment_score ? Math.round((result.sentiment_score + 1) * 50) : 50;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>{getScreeningTypeLabel(result.screening_type)}</span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Laporan <span className="text-gradient">Kesehatan Mental</span>
            </h1>
            <p className="text-muted-foreground">
              {new Date(result.created_at).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </motion.div>

          {/* Main Risk Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className={`mb-6 border-2 ${riskConfig.bgClass}`}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center bg-background/50">
                    <RiskIcon className="w-12 h-12" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-display font-bold mb-2">{riskConfig.label}</h2>
                    <p className="text-muted-foreground mb-4">{riskConfig.message}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Tingkat Risiko</span>
                          <span className="font-medium">{riskConfig.progress}%</span>
                        </div>
                        <Progress value={riskConfig.progress} className="h-3" />
                      </div>
                      {result.confidence && (
                        <div className="text-center px-4 py-2 rounded-lg bg-card border">
                          <p className="text-xs text-muted-foreground">Kepercayaan</p>
                          <p className="text-lg font-bold">{Math.round(result.confidence * 100)}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs for different views */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="risk">Indeks Risiko</TabsTrigger>
              <TabsTrigger value="emotions">Analisis Emosi</TabsTrigger>
              <TabsTrigger value="trends">Tren Emosi</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Sentiment & Emotion Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Skor Sentimen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-32 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(hsl(var(--primary)) ${sentimentPercent}%, hsl(var(--muted)) ${sentimentPercent}%)`, mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), white calc(100% - 8px))", WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 8px), white calc(100% - 8px))" }} />
                        <span className="text-3xl font-bold">{sentimentPercent}%</span>
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {sentimentPercent >= 70 ? "Sentimen positif terdeteksi" : sentimentPercent >= 40 ? "Sentimen netral" : "Sentimen negatif terdeteksi"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Brain className="w-5 h-5 text-secondary" />
                      Emosi Dominan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3">
                          <span className="text-4xl">
                            {result.dominant_emotion === "happiness" ? "😊" : result.dominant_emotion === "sadness" ? "😢" : result.dominant_emotion === "anxiety" ? "😰" : result.dominant_emotion === "anger" ? "😠" : result.dominant_emotion === "fear" ? "😨" : result.dominant_emotion === "hopeful" ? "🌟" : result.dominant_emotion === "stressed" ? "😫" : "😐"}
                          </span>
                        </div>
                        <p className="text-xl font-semibold capitalize">{getEmotionLabel(result.dominant_emotion || "neutral")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Rekomendasi untuk Anda
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-xl border ${rec.type === "urgent" ? "bg-destructive/5 border-destructive/20" : "bg-muted/50 border-border/50"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${rec.type === "urgent" ? "bg-destructive/20" : "bg-primary/20"}`}>
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="risk" className="mt-6">
              <MultidimensionalRiskScore
                chatAnalysis={{
                  sentimentScore: result.sentiment_score || 0,
                  dominantEmotion: result.dominant_emotion || "neutral",
                  riskLevel: result.risk_level,
                  confidence: result.confidence || 0.7,
                }}
                phq9Score={result.screening_type === "phq9" ? Math.round(riskConfig.progress * 0.27) : undefined}
                gad7Score={result.screening_type === "gad7" ? Math.round(riskConfig.progress * 0.21) : undefined}
                screeningFrequency={history.length || 1}
                emotionTrends={{
                  improving: (result.sentiment_score || 0) > 0,
                  volatility: 0.2,
                }}
              />
            </TabsContent>

            <TabsContent value="emotions" className="mt-6">
              <EmotionAnalytics emotionData={generateEmotionData()} riskIndicators={generateRiskIndicators()} dominantEmotion={result.dominant_emotion || "neutral"} sentimentScore={result.sentiment_score || 0} />
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <TemporalEmotionTrend 
                data={history.length > 0 ? history.map(h => ({
                  date: h.created_at,
                  happiness: h.dominant_emotion === "happiness" ? 0.6 : 0.1,
                  sadness: h.dominant_emotion === "sadness" ? 0.6 : 0.1,
                  anxiety: h.dominant_emotion === "anxiety" ? 0.6 : 0.1,
                  anger: h.dominant_emotion === "anger" ? 0.5 : 0.05,
                  fear: h.dominant_emotion === "fear" ? 0.5 : 0.05,
                  hopeful: h.dominant_emotion === "hopeful" ? 0.6 : 0.1,
                  stressed: h.dominant_emotion === "stressed" ? 0.5 : 0.1,
                  neutral: h.dominant_emotion === "neutral" ? 0.5 : 0.1,
                  overallSentiment: h.sentiment_score || 0,
                })) : [{
                  date: result.created_at,
                  happiness: result.dominant_emotion === "happiness" ? 0.6 : 0.1,
                  sadness: result.dominant_emotion === "sadness" ? 0.6 : 0.1,
                  anxiety: result.dominant_emotion === "anxiety" ? 0.6 : 0.1,
                  anger: result.dominant_emotion === "anger" ? 0.5 : 0.05,
                  fear: result.dominant_emotion === "fear" ? 0.5 : 0.05,
                  hopeful: result.dominant_emotion === "hopeful" ? 0.6 : 0.1,
                  stressed: result.dominant_emotion === "stressed" ? 0.5 : 0.1,
                  neutral: result.dominant_emotion === "neutral" ? 0.5 : 0.1,
                  overallSentiment: result.sentiment_score || 0,
                }]}
              />
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              {user && history.length > 0 ? (
                <ProgressTracking history={history} />
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Masuk untuk melihat progress skrining Anda dari waktu ke waktu</p>
                    <Link to="/login"><Button variant="outline">Masuk</Button></Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Emergency Contact */}
          {result.risk_level === "tinggi" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Card className="border-2 border-destructive/30 bg-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Butuh Bantuan Segera?</h3>
                      <p className="text-sm text-muted-foreground">Jangan ragu untuk menghubungi layanan bantuan</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a href="tel:1198" className="flex items-center gap-3 p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors">
                      <span className="text-2xl font-bold text-destructive">1198</span>
                      <span className="text-sm text-muted-foreground">Hotline Kesehatan Jiwa</span>
                    </a>
                    <a href="tel:112" className="flex items-center gap-3 p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors">
                      <span className="text-2xl font-bold text-destructive">112</span>
                      <span className="text-sm text-muted-foreground">Darurat Nasional</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="gap-2" onClick={handleDownloadPDF} disabled={downloading}>
              <Download className="w-4 h-4" />
              {downloading ? "Mengunduh..." : "Download PDF"}
            </Button>
            <Link to="/screening"><Button variant="outline" className="gap-2"><RefreshCcw className="w-4 h-4" />Skrining Ulang</Button></Link>
            <Link to="/analytics"><Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"><BarChart3 className="w-4 h-4" />Lihat Analitik<ArrowRight className="w-4 h-4" /></Button></Link>
          </motion.div>

          {/* Disclaimer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Penting:</strong> Hasil ini merupakan skrining awal berbasis AI dan bukan diagnosis medis. Untuk penanganan yang tepat, silakan berkonsultasi dengan psikolog atau psikiater.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScreeningResultPage;
