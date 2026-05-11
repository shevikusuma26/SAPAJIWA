import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ScreeningHistory {
  id: string;
  created_at: string;
  risk_level: string;
  sentiment_score: number | null;
  dominant_emotion: string | null;
  screening_type: string;
  phq9_score?: number | null;
  gad7_score?: number | null;
}

interface ProgressTrackingProps {
  history: ScreeningHistory[];
}

export function ProgressTracking({ history }: ProgressTrackingProps) {
  // Prepare chart data
  const chartData = history
    .slice()
    .reverse()
    .map((item, index) => ({
      date: format(new Date(item.created_at), "dd MMM", { locale: id }),
      fullDate: format(new Date(item.created_at), "dd MMMM yyyy", { locale: id }),
      sentiment: item.sentiment_score ? Math.round((item.sentiment_score + 1) * 50) : 50,
      riskScore: item.risk_level === "tinggi" ? 90 : item.risk_level === "sedang" ? 50 : 20,
      phq9: item.phq9_score || null,
      gad7: item.gad7_score || null,
      index: index + 1,
    }));

  // Calculate trends
  const calculateTrend = (key: "sentiment" | "riskScore") => {
    if (chartData.length < 2) return { trend: "stable", change: 0 };
    const recent = chartData.slice(-3);
    const older = chartData.slice(0, -3);
    
    const avgRecent = recent.reduce((sum, d) => sum + d[key], 0) / recent.length;
    const avgOlder = older.length > 0 
      ? older.reduce((sum, d) => sum + d[key], 0) / older.length 
      : avgRecent;
    
    const change = Math.round(avgRecent - avgOlder);
    
    if (change > 5) return { trend: "improving", change };
    if (change < -5) return { trend: "declining", change };
    return { trend: "stable", change };
  };

  const sentimentTrend = calculateTrend("sentiment");
  const riskTrend = calculateTrend("riskScore");

  // Statistics
  const stats = {
    totalScreenings: history.length,
    avgSentiment: Math.round(
      history.reduce((sum, h) => sum + ((h.sentiment_score || 0) + 1) * 50, 0) / 
      (history.length || 1)
    ),
    highRiskCount: history.filter(h => h.risk_level === "tinggi").length,
    mostCommonEmotion: getMostCommonEmotion(history),
  };

  function getMostCommonEmotion(data: ScreeningHistory[]) {
    const emotionCount: Record<string, number> = {};
    data.forEach(item => {
      if (item.dominant_emotion) {
        emotionCount[item.dominant_emotion] = (emotionCount[item.dominant_emotion] || 0) + 1;
      }
    });
    const sorted = Object.entries(emotionCount).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "neutral";
  }

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

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Skrining</p>
                <p className="text-2xl font-bold">{stats.totalScreenings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Sentimen</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.avgSentiment}%</p>
                  {sentimentTrend.trend === "improving" && (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  )}
                  {sentimentTrend.trend === "declining" && (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risiko Tinggi</p>
                <p className="text-2xl font-bold">{stats.highRiskCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <span className="text-lg">
                  {stats.mostCommonEmotion === "happiness" ? "😊" :
                   stats.mostCommonEmotion === "sadness" ? "😢" :
                   stats.mostCommonEmotion === "anxiety" ? "😰" :
                   stats.mostCommonEmotion === "anger" ? "😠" :
                   stats.mostCommonEmotion === "hopeful" ? "🌟" :
                   stats.mostCommonEmotion === "stressed" ? "😫" : "😐"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emosi Dominan</p>
                <p className="text-lg font-semibold capitalize">
                  {getEmotionLabel(stats.mostCommonEmotion)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sentiment & Risk Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Tren Sentimen & Risiko
                </CardTitle>
                <CardDescription>
                  Perbandingan skor sentimen dan tingkat risiko dari waktu ke waktu
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {sentimentTrend.trend === "improving" ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : sentimentTrend.trend === "declining" ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${
                    sentimentTrend.trend === "improving" ? "text-success" :
                    sentimentTrend.trend === "declining" ? "text-destructive" :
                    "text-muted-foreground"
                  }`}>
                    {sentimentTrend.change > 0 ? "+" : ""}{sentimentTrend.change}%
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 1 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        name === "sentiment" ? "Sentimen" : "Risiko"
                      ]}
                      labelFormatter={(label) => {
                        const item = chartData.find(d => d.date === label);
                        return item?.fullDate || label;
                      }}
                    />
                    <Legend 
                      formatter={(value) => value === "sentiment" ? "Sentimen" : "Risiko"}
                    />
                    <Line
                      type="monotone"
                      dataKey="sentiment"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="riskScore"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
                <div className="text-center px-4">
                  <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Lakukan lebih banyak skrining untuk melihat tren progress Anda
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* PHQ-9 & GAD-7 Comparison if available */}
      {chartData.some(d => d.phq9 !== null || d.gad7 !== null) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Skor PHQ-9 & GAD-7
              </CardTitle>
              <CardDescription>
                Perbandingan skor kuesioner depresi dan kecemasan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.filter(d => d.phq9 !== null || d.gad7 !== null)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 27]}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="phq9" name="PHQ-9 (Depresi)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gad7" name="GAD-7 (Kecemasan)" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Screenings Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Riwayat Skrining Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {history.slice(0, 10).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    item.risk_level === "tinggi" ? "bg-destructive" :
                    item.risk_level === "sedang" ? "bg-warning" :
                    "bg-success"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {item.screening_type === "chat" ? "Chat Skrining" : 
                         item.screening_type === "phq9" ? "PHQ-9" :
                         item.screening_type === "gad7" ? "GAD-7" : "Skrining"}
                      </p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.risk_level === "tinggi" ? "bg-destructive/10 text-destructive" :
                        item.risk_level === "sedang" ? "bg-warning/10 text-warning" :
                        "bg-success/10 text-success"
                      }`}>
                        Risiko {item.risk_level}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(item.created_at), "dd MMMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
