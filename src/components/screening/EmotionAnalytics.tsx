import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Zap,
  CloudRain,
  Frown,
  Smile,
  Meh,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface EmotionData {
  happiness: number;
  sadness: number;
  anxiety: number;
  anger: number;
  fear: number;
  hopeful: number;
  stressed: number;
  neutral: number;
}

interface RiskIndicator {
  type: string;
  level: "low" | "medium" | "high";
  description: string;
  score: number;
}

interface ProgressData {
  date: string;
  sentiment: number;
  riskScore: number;
}

interface EmotionAnalyticsProps {
  emotionData: EmotionData;
  riskIndicators: RiskIndicator[];
  progressData?: ProgressData[];
  dominantEmotion: string;
  sentimentScore: number;
}

export function EmotionAnalytics({
  emotionData,
  riskIndicators,
  progressData,
  dominantEmotion,
  sentimentScore,
}: EmotionAnalyticsProps) {
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "happiness": return <Smile className="w-5 h-5" />;
      case "sadness": return <CloudRain className="w-5 h-5" />;
      case "anxiety": return <Zap className="w-5 h-5" />;
      case "anger": return <Frown className="w-5 h-5" />;
      case "fear": return <AlertTriangle className="w-5 h-5" />;
      case "hopeful": return <Heart className="w-5 h-5" />;
      case "stressed": return <Zap className="w-5 h-5" />;
      default: return <Meh className="w-5 h-5" />;
    }
  };

  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      happiness: "Kebahagiaan",
      sadness: "Kesedihan",
      anxiety: "Kecemasan",
      anger: "Kemarahan",
      fear: "Ketakutan",
      hopeful: "Harapan",
      stressed: "Stres",
      neutral: "Netral",
    };
    return labels[emotion] || emotion;
  };

  const getRiskLevelConfig = (level: string) => {
    switch (level) {
      case "high":
        return {
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          icon: AlertTriangle,
        };
      case "medium":
        return {
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          icon: Info,
        };
      default:
        return {
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          icon: CheckCircle,
        };
    }
  };

  const getTrend = (data: ProgressData[]) => {
    if (data.length < 2) return "stable";
    const recent = data.slice(-3);
    const avgRecent = recent.reduce((sum, d) => sum + d.sentiment, 0) / recent.length;
    const older = data.slice(0, -3);
    const avgOlder = older.length > 0 ? older.reduce((sum, d) => sum + d.sentiment, 0) / older.length : avgRecent;
    
    if (avgRecent > avgOlder + 0.1) return "improving";
    if (avgRecent < avgOlder - 0.1) return "declining";
    return "stable";
  };

  // Prepare radar chart data
  const radarData = Object.entries(emotionData).map(([key, value]) => ({
    emotion: getEmotionLabel(key),
    value: value * 100,
    fullMark: 100,
  }));

  // Sorted emotions for bar display
  const sortedEmotions = Object.entries(emotionData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sentimentPercent = Math.round((sentimentScore + 1) * 50);
  const trend = progressData ? getTrend(progressData) : "stable";

  return (
    <div className="space-y-6">
      {/* Emotion Distribution Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Analisis Emosi Mendalam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="emotion" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    />
                    <Radar
                      name="Intensitas"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Emotions Bar */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Emosi Terdeteksi</h4>
                {sortedEmotions.map(([emotion, value], index) => (
                  <motion.div
                    key={emotion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={emotion === dominantEmotion ? "text-primary" : "text-muted-foreground"}>
                          {getEmotionIcon(emotion)}
                        </span>
                        <span className={`text-sm ${emotion === dominantEmotion ? "font-semibold" : ""}`}>
                          {getEmotionLabel(emotion)}
                        </span>
                        {emotion === dominantEmotion && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Dominan
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Indikator Risiko
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskIndicators.map((indicator, index) => {
                const config = getRiskLevelConfig(indicator.level);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={indicator.type}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{indicator.type}</p>
                          <span className={`text-xs font-medium ${config.color}`}>
                            {indicator.level === "high" ? "Tinggi" : indicator.level === "medium" ? "Sedang" : "Rendah"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{indicator.description}</p>
                        <div className="mt-2">
                          <Progress value={indicator.score} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sentiment Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Skor Sentimen & Tren
              </CardTitle>
              <div className="flex items-center gap-2">
                {trend === "improving" && (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="w-4 h-4" />
                    Membaik
                  </span>
                )}
                {trend === "declining" && (
                  <span className="flex items-center gap-1 text-sm text-destructive">
                    <TrendingDown className="w-4 h-4" />
                    Menurun
                  </span>
                )}
                {trend === "stable" && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Minus className="w-4 h-4" />
                    Stabil
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sentiment Score Display */}
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(var(--muted))"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#sentimentGradient)"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${sentimentPercent * 4.4} 440`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{sentimentPercent}%</span>
                    <span className="text-sm text-muted-foreground">Sentimen</span>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              {progressData && progressData.length > 1 && (
                <div className="md:col-span-2 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[-1, 1]}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <defs>
                        <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="sentiment"
                        stroke="hsl(var(--primary))"
                        fill="url(#colorSentiment)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {(!progressData || progressData.length <= 1) && (
                <div className="md:col-span-2 flex items-center justify-center h-40 bg-muted/30 rounded-xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    Lakukan lebih banyak skrining untuk melihat tren sentimen Anda dari waktu ke waktu
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
