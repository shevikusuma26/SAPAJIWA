import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Heart,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RegionData {
  region: string;
  resilienceScore: number;
  totalScreenings: number;
  avgSentiment: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  trend: "improving" | "declining" | "stable";
}

interface CommunityResilienceIndexProps {
  regions: RegionData[];
  nationalAverage: number;
}

export const CommunityResilienceIndex = ({
  regions,
  nationalAverage,
}: CommunityResilienceIndexProps) => {
  // Sort regions by resilience score
  const sortedRegions = [...regions].sort((a, b) => b.resilienceScore - a.resilienceScore);
  const topRegions = sortedRegions.slice(0, 5);
  const needsAttention = sortedRegions.filter(r => r.resilienceScore < 50).slice(0, 3);

  const getResilienceColor = (score: number) => {
    if (score >= 70) return "success";
    if (score >= 50) return "warning";
    return "destructive";
  };

  const getResilienceLabel = (score: number) => {
    if (score >= 70) return "Baik";
    if (score >= 50) return "Sedang";
    return "Perlu Perhatian";
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-xl font-display flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Community Resilience Index
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                Society 5.0 Initiative
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* National Average */}
              <div className="text-center p-6 rounded-2xl bg-background/80 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Rata-rata Nasional</p>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={`hsl(var(--${getResilienceColor(nationalAverage)}))`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${nationalAverage * 2.64} 264`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{nationalAverage}</span>
                  </div>
                </div>
                <p className={`text-sm font-medium text-${getResilienceColor(nationalAverage)}`}>
                  {getResilienceLabel(nationalAverage)}
                </p>
              </div>

              {/* Total Coverage */}
              <div className="text-center p-6 rounded-2xl bg-background/80 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Wilayah Terpantau</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <MapPin className="w-8 h-8 text-primary" />
                  <span className="text-4xl font-bold">{regions.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {regions.reduce((sum, r) => sum + r.totalScreenings, 0).toLocaleString()} total skrining
                </p>
              </div>

              {/* Positive Trend */}
              <div className="text-center p-6 rounded-2xl bg-background/80 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Tren Positif</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <TrendingUp className="w-8 h-8 text-success" />
                  <span className="text-4xl font-bold">
                    {regions.filter(r => r.trend === "improving").length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  wilayah menunjukkan perbaikan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Regions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Heart className="w-5 h-5 text-success" />
                Wilayah Ketahanan Terbaik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topRegions.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30"
                >
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{region.region}</span>
                      <span className="text-sm font-bold text-success">{region.resilienceScore}</span>
                    </div>
                    <Progress value={region.resilienceScore} className="h-1.5 [&>div]:bg-success" />
                  </div>
                  {region.trend === "improving" && (
                    <TrendingUp className="w-4 h-4 text-success" />
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Needs Attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Activity className="w-5 h-5 text-warning" />
                Wilayah Prioritas Intervensi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {needsAttention.length > 0 ? (
                needsAttention.map((region, index) => (
                  <motion.div
                    key={region.region}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="p-4 rounded-xl border border-warning/30 bg-warning/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{region.region}</span>
                      <span className={`text-sm font-bold text-${getResilienceColor(region.resilienceScore)}`}>
                        {region.resilienceScore}
                      </span>
                    </div>
                    <Progress 
                      value={region.resilienceScore} 
                      className={`h-1.5 mb-3 [&>div]:bg-${getResilienceColor(region.resilienceScore)}`} 
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{region.totalScreenings} skrining</span>
                      <span>Risiko tinggi: {region.riskDistribution.high}%</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Semua wilayah menunjukkan ketahanan yang baik</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-muted-foreground p-4 rounded-xl bg-muted/30">
        <Shield className="w-4 h-4 inline-block mr-2" />
        Data agregat anonim. Tidak ada informasi individu yang ditampilkan untuk menjaga privasi pengguna.
      </div>
    </div>
  );
};

export default CommunityResilienceIndex;