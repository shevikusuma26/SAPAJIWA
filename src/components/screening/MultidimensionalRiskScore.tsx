import { motion } from "framer-motion";
import { 
  Brain, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RiskContributor {
  source: string;
  label: string;
  score: number;
  weight: number;
  factors: string[];
  icon: React.ElementType;
}

interface MultidimensionalRiskScoreProps {
  chatAnalysis?: {
    sentimentScore: number;
    dominantEmotion: string;
    riskLevel: string;
    confidence: number;
  };
  phq9Score?: number;
  gad7Score?: number;
  screeningFrequency: number;
  emotionTrends?: {
    improving: boolean;
    volatility: number;
  };
}

export const MultidimensionalRiskScore = ({
  chatAnalysis,
  phq9Score,
  gad7Score,
  screeningFrequency,
  emotionTrends,
}: MultidimensionalRiskScoreProps) => {
  // Calculate normalized scores (0-100)
  const normalizePHQ9 = (score?: number) => score ? Math.min((score / 27) * 100, 100) : 0;
  const normalizeGAD7 = (score?: number) => score ? Math.min((score / 21) * 100, 100) : 0;
  const normalizeChatRisk = (analysis?: typeof chatAnalysis) => {
    if (!analysis) return 0;
    const baseScore = analysis.riskLevel === "tinggi" ? 80 : analysis.riskLevel === "sedang" ? 50 : 20;
    const sentimentAdjust = (1 - ((analysis.sentimentScore + 1) / 2)) * 20;
    return Math.min(baseScore + sentimentAdjust, 100);
  };
  const normalizeFrequency = (freq: number) => {
    // High frequency might indicate distress
    if (freq > 10) return 60;
    if (freq > 5) return 40;
    return 20;
  };

  // Weights for composite score
  const weights = {
    chat: 0.30,
    phq9: 0.25,
    gad7: 0.25,
    frequency: 0.10,
    trends: 0.10,
  };

  // Individual component scores
  const chatScore = normalizeChatRisk(chatAnalysis);
  const phq9NormScore = normalizePHQ9(phq9Score);
  const gad7NormScore = normalizeGAD7(gad7Score);
  const freqScore = normalizeFrequency(screeningFrequency);
  const trendScore = emotionTrends ? (emotionTrends.improving ? 20 : 50 + emotionTrends.volatility * 30) : 30;

  // Calculate composite psychosocial risk index
  const compositeScore = Math.round(
    chatScore * weights.chat +
    phq9NormScore * weights.phq9 +
    gad7NormScore * weights.gad7 +
    freqScore * weights.frequency +
    trendScore * weights.trends
  );

  // Determine overall risk level
  const getRiskLevel = (score: number) => {
    if (score >= 65) return { level: "tinggi", label: "Risiko Tinggi", color: "destructive" };
    if (score >= 40) return { level: "sedang", label: "Risiko Sedang", color: "warning" };
    return { level: "rendah", label: "Risiko Rendah", color: "success" };
  };

  const overallRisk = getRiskLevel(compositeScore);

  // Build XAI explanation
  const contributors: RiskContributor[] = [
    {
      source: "chat",
      label: "Analisis Chat NLP",
      score: chatScore,
      weight: weights.chat * 100,
      factors: chatAnalysis ? [
        `Emosi dominan: ${getEmotionLabel(chatAnalysis.dominantEmotion)}`,
        `Sentimen: ${chatAnalysis.sentimentScore > 0 ? "Positif" : chatAnalysis.sentimentScore < 0 ? "Negatif" : "Netral"}`,
        `Tingkat risiko chat: ${chatAnalysis.riskLevel}`,
      ] : ["Belum ada data chat"],
      icon: MessageSquare,
    },
    {
      source: "phq9",
      label: "Skor PHQ-9 (Depresi)",
      score: phq9NormScore,
      weight: weights.phq9 * 100,
      factors: phq9Score !== undefined ? [
        `Skor mentah: ${phq9Score}/27`,
        getPHQ9Interpretation(phq9Score),
      ] : ["Belum ada data PHQ-9"],
      icon: FileText,
    },
    {
      source: "gad7",
      label: "Skor GAD-7 (Kecemasan)",
      score: gad7NormScore,
      weight: weights.gad7 * 100,
      factors: gad7Score !== undefined ? [
        `Skor mentah: ${gad7Score}/21`,
        getGAD7Interpretation(gad7Score),
      ] : ["Belum ada data GAD-7"],
      icon: Brain,
    },
    {
      source: "frequency",
      label: "Frekuensi Skrining",
      score: freqScore,
      weight: weights.frequency * 100,
      factors: [
        `${screeningFrequency} skrining dalam 30 hari`,
        screeningFrequency > 10 ? "Frekuensi tinggi mungkin menunjukkan kebutuhan dukungan" : "Frekuensi normal",
      ],
      icon: TrendingUp,
    },
  ];

  // Sort by contribution to risk (score * weight)
  const sortedContributors = [...contributors].sort((a, b) => 
    (b.score * b.weight) - (a.score * a.weight)
  );

  // Generate XAI summary
  const topFactors = sortedContributors.slice(0, 3).filter(c => c.score > 30);
  const xaiSummary = generateXAISummary(topFactors, overallRisk.level, compositeScore);

  return (
    <div className="space-y-6">
      {/* Main Composite Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`border-2 ${
          overallRisk.color === "destructive" ? "border-destructive/30 bg-destructive/5" :
          overallRisk.color === "warning" ? "border-warning/30 bg-warning/5" :
          "border-success/30 bg-success/5"
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Composite Psychosocial Risk Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Score Display */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      overallRisk.color === "destructive" ? "hsl(var(--destructive))" :
                      overallRisk.color === "warning" ? "hsl(38, 92%, 50%)" :
                      "hsl(var(--success))"
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${compositeScore * 2.83} 283`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{compositeScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>

              {/* Risk Level & Summary */}
              <div className="flex-1 text-center md:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                  overallRisk.color === "destructive" ? "bg-destructive/20 text-destructive" :
                  overallRisk.color === "warning" ? "bg-warning/20 text-warning-foreground" :
                  "bg-success/20 text-success"
                }`}>
                  {overallRisk.color === "destructive" ? <AlertTriangle className="w-4 h-4" /> :
                   overallRisk.color === "warning" ? <Info className="w-4 h-4" /> :
                   <CheckCircle className="w-4 h-4" />}
                  <span className="font-semibold">{overallRisk.label}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Indeks risiko psikososial dihitung dari kombinasi analisis chat berbasis NLP, 
                  skor kuesioner PHQ-9 dan GAD-7, serta pola frekuensi skrining.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* XAI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Explainable AI (XAI) Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-background/80 border border-border/50">
              <p className="text-foreground leading-relaxed">{xaiSummary}</p>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>* Penjelasan ini dihasilkan secara otomatis untuk memastikan transparansi dan akuntabilitas penilaian risiko.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Contributors Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Kontribusi Faktor Risiko</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedContributors.map((contributor, index) => {
              const Icon = contributor.icon;
              const contribution = Math.round(contributor.score * contributor.weight / 100);
              return (
                <motion.div
                  key={contributor.source}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 rounded-xl border border-border/50 bg-card"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      contributor.score > 60 ? "bg-destructive/10" :
                      contributor.score > 35 ? "bg-warning/10" :
                      "bg-success/10"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        contributor.score > 60 ? "text-destructive" :
                        contributor.score > 35 ? "text-warning" :
                        "text-success"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{contributor.label}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Bobot: {contributor.weight}%</span>
                          <span className="font-bold">{contributor.score.toFixed(0)}</span>
                        </div>
                      </div>
                      <Progress 
                        value={contributor.score} 
                        className={`h-2 mb-3 ${
                          contributor.score > 60 ? "[&>div]:bg-destructive" :
                          contributor.score > 35 ? "[&>div]:bg-warning" :
                          "[&>div]:bg-success"
                        }`}
                      />
                      <ul className="space-y-1">
                        {contributor.factors.map((factor, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Kontribusi terhadap skor total: <span className="font-medium text-foreground">+{contribution} poin</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Helper functions
function getEmotionLabel(emotion: string): string {
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
}

function getPHQ9Interpretation(score: number): string {
  if (score >= 20) return "Depresi berat";
  if (score >= 15) return "Depresi cukup berat";
  if (score >= 10) return "Depresi sedang";
  if (score >= 5) return "Depresi ringan";
  return "Minimal atau tidak ada depresi";
}

function getGAD7Interpretation(score: number): string {
  if (score >= 15) return "Kecemasan berat";
  if (score >= 10) return "Kecemasan sedang";
  if (score >= 5) return "Kecemasan ringan";
  return "Minimal atau tidak ada kecemasan";
}

function generateXAISummary(
  topFactors: RiskContributor[],
  riskLevel: string,
  compositeScore: number
): string {
  if (topFactors.length === 0) {
    return "Berdasarkan data yang tersedia, tidak ditemukan faktor risiko signifikan. Teruskan aktivitas yang mendukung kesehatan mental Anda.";
  }

  const factorDescriptions = topFactors.map(f => {
    switch (f.source) {
      case "chat":
        return "pola bahasa dalam percakapan";
      case "phq9":
        return "hasil kuesioner depresi (PHQ-9)";
      case "gad7":
        return "hasil kuesioner kecemasan (GAD-7)";
      case "frequency":
        return "frekuensi skrining yang tinggi";
      default:
        return f.label.toLowerCase();
    }
  });

  const mainFactor = factorDescriptions[0];
  const otherFactors = factorDescriptions.slice(1).join(" dan ");

  let summary = `Penilaian risiko ${riskLevel} (skor ${compositeScore}/100) terutama dipengaruhi oleh ${mainFactor}`;
  
  if (otherFactors) {
    summary += `, dengan kontribusi tambahan dari ${otherFactors}`;
  }

  summary += ". ";

  if (riskLevel === "tinggi") {
    summary += "Disarankan untuk berkonsultasi dengan profesional kesehatan mental untuk mendapatkan dukungan yang tepat.";
  } else if (riskLevel === "sedang") {
    summary += "Pertimbangkan untuk melakukan langkah-langkah pencegahan dan tetap pantau kondisi kesehatan mental Anda.";
  } else {
    summary += "Kondisi Anda tampak baik, teruskan aktivitas positif untuk menjaga kesejahteraan mental.";
  }

  return summary;
}

export default MultidimensionalRiskScore;