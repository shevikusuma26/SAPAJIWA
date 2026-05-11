import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Area,
  ComposedChart
} from "recharts";

interface EmotionDataPoint {
  date: string;
  happiness: number;
  sadness: number;
  anxiety: number;
  anger: number;
  fear: number;
  hopeful: number;
  stressed: number;
  neutral: number;
  overallSentiment: number;
}

interface TemporalEmotionTrendProps {
  data: EmotionDataPoint[];
  showInsights?: boolean;
}

const EMOTION_COLORS: Record<string, string> = {
  happiness: "hsl(142, 76%, 45%)",
  sadness: "hsl(217, 91%, 60%)",
  anxiety: "hsl(38, 92%, 50%)",
  anger: "hsl(0, 84%, 60%)",
  fear: "hsl(270, 60%, 60%)",
  hopeful: "hsl(160, 84%, 39%)",
  stressed: "hsl(25, 95%, 53%)",
  neutral: "hsl(215, 16%, 47%)",
};

const EMOTION_LABELS: Record<string, string> = {
  happiness: "Kebahagiaan",
  sadness: "Kesedihan",
  anxiety: "Kecemasan",
  anger: "Kemarahan",
  fear: "Ketakutan",
  hopeful: "Harapan",
  stressed: "Stres",
  neutral: "Netral",
};

export const TemporalEmotionTrend = ({ data, showInsights = true }: TemporalEmotionTrendProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada data tren emosi. Lakukan beberapa skrining untuk melihat tren.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate insights
  const calculateTrend = () => {
    if (data.length < 2) return { direction: "stable", change: 0 };
    
    const recentData = data.slice(-7);
    const olderData = data.slice(0, -7);
    
    if (olderData.length === 0) return { direction: "stable", change: 0 };
    
    const recentAvg = recentData.reduce((sum, d) => sum + d.overallSentiment, 0) / recentData.length;
    const olderAvg = olderData.reduce((sum, d) => sum + d.overallSentiment, 0) / olderData.length;
    
    const change = recentAvg - olderAvg;
    
    if (change > 0.1) return { direction: "improving", change };
    if (change < -0.1) return { direction: "declining", change };
    return { direction: "stable", change };
  };

  const calculateVolatility = () => {
    if (data.length < 3) return 0;
    
    const sentiments = data.map(d => d.overallSentiment);
    const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const variance = sentiments.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sentiments.length;
    
    return Math.sqrt(variance);
  };

  const findDominantEmotionShifts = () => {
    const shifts: { from: string; to: string; date: string }[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const prevEmotions = Object.entries(data[i - 1]).filter(([key]) => 
        !["date", "overallSentiment"].includes(key)
      );
      const currEmotions = Object.entries(data[i]).filter(([key]) => 
        !["date", "overallSentiment"].includes(key)
      );
      
      const prevDominant = prevEmotions.sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
      const currDominant = currEmotions.sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
      
      if (prevDominant !== currDominant) {
        shifts.push({ from: prevDominant, to: currDominant, date: data[i].date });
      }
    }
    
    return shifts.slice(-3);
  };

  const trend = calculateTrend();
  const volatility = calculateVolatility();
  const emotionShifts = findDominantEmotionShifts();

  // Prepare chart data with formatted dates
  const chartData = data.map(d => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
  }));

  return (
    <div className="space-y-6">
      {/* Main Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Tren Emosi Temporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="dateLabel" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    tickLine={false}
                    domain={[-1, 1]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      value.toFixed(2),
                      name === "overallSentiment" ? "Sentimen Keseluruhan" : EMOTION_LABELS[name] || name
                    ]}
                  />
                  <Legend 
                    formatter={(value) => 
                      value === "overallSentiment" ? "Sentimen Keseluruhan" : EMOTION_LABELS[value] || value
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="overallSentiment"
                    fill="url(#sentimentGradient)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="happiness"
                    stroke={EMOTION_COLORS.happiness}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="anxiety"
                    stroke={EMOTION_COLORS.anxiety}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sadness"
                    stroke={EMOTION_COLORS.sadness}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Cards */}
      {showInsights && (
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Trend Direction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    trend.direction === "improving" ? "bg-success/10" :
                    trend.direction === "declining" ? "bg-destructive/10" :
                    "bg-muted"
                  }`}>
                    {trend.direction === "improving" ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : trend.direction === "declining" ? (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    ) : (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tren</p>
                    <p className="font-semibold capitalize">
                      {trend.direction === "improving" ? "Membaik" :
                       trend.direction === "declining" ? "Menurun" : "Stabil"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {trend.direction === "improving" 
                    ? "Sentimen Anda menunjukkan perbaikan positif dalam 7 hari terakhir."
                    : trend.direction === "declining"
                    ? "Perhatikan kondisi emosional Anda yang menunjukkan penurunan."
                    : "Kondisi emosional Anda relatif stabil."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Volatility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    volatility > 0.3 ? "bg-warning/10" : "bg-success/10"
                  }`}>
                    <Activity className={`w-5 h-5 ${
                      volatility > 0.3 ? "text-warning" : "text-success"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volatilitas</p>
                    <p className="font-semibold">
                      {volatility > 0.3 ? "Tinggi" : volatility > 0.15 ? "Sedang" : "Rendah"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {volatility > 0.3 
                    ? "Emosi Anda menunjukkan fluktuasi yang tinggi. Pertimbangkan teknik relaksasi."
                    : "Stabilitas emosional Anda baik."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Shifts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pergeseran Emosi</p>
                    <p className="font-semibold">{emotionShifts.length} perubahan</p>
                  </div>
                </div>
                {emotionShifts.length > 0 ? (
                  <div className="space-y-1">
                    {emotionShifts.slice(0, 2).map((shift, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {EMOTION_LABELS[shift.from]} → {EMOTION_LABELS[shift.to]}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Emosi dominan konsisten
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TemporalEmotionTrend;