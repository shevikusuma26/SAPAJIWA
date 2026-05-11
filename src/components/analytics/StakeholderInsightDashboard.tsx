import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  Users,
  Target,
  Clock,
  Shield,
  Brain,
  Heart,
  ArrowRight,
  Download,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateStakeholderPDF } from "@/utils/stakeholderPdfExport";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Insight {
  id: string;
  type: "priority" | "trend" | "intervention" | "alert";
  title: string;
  description: string;
  metric?: {
    value: number;
    unit: string;
    change?: number;
  };
  priority: "high" | "medium" | "low";
  actionable: boolean;
  suggestedAction?: string;
}

interface PriorityArea {
  region: string;
  riskScore: number;
  population: number;
  needs: string[];
  urgency: "critical" | "high" | "moderate";
}

interface TrendData {
  category: string;
  currentValue: number;
  previousValue: number;
  trend: "up" | "down" | "stable";
  interpretation: string;
}

interface StakeholderInsightDashboardProps {
  insights: Insight[];
  priorityAreas: PriorityArea[];
  trends: TrendData[];
  lastUpdated: string;
}

const INSIGHT_ICONS: Record<Insight["type"], React.ElementType> = {
  priority: MapPin,
  trend: TrendingUp,
  intervention: Target,
  alert: AlertCircle,
};

const INSIGHT_COLORS: Record<Insight["type"], string> = {
  priority: "primary",
  trend: "secondary",
  intervention: "success",
  alert: "destructive",
};

export const StakeholderInsightDashboard = ({
  insights,
  priorityAreas,
  trends,
  lastUpdated,
}: StakeholderInsightDashboardProps) => {
  const [downloading, setDownloading] = useState(false);

  // Group insights by priority
  const highPriorityInsights = insights.filter(i => i.priority === "high");
  const otherInsights = insights.filter(i => i.priority !== "high");

  const criticalAreas = priorityAreas.filter(a => a.urgency === "critical");

  const handleExportPDF = async () => {
    setDownloading(true);
    try {
      await generateStakeholderPDF({ insights, priorityAreas, trends, lastUpdated });
      toast.success("Laporan PDF berhasil diunduh!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Gagal membuat laporan PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Last Updated */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Stakeholder Insights</h2>
            <p className="text-sm text-muted-foreground">Wawasan otomatis untuk pengambilan keputusan</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleExportPDF}
            disabled={downloading}
            variant="outline"
            className="gap-2"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {downloading ? "Mengunduh..." : "Export PDF"}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Diperbarui: {new Date(lastUpdated).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>
        </div>
      </motion.div>

      {/* Critical Alerts */}
      {highPriorityInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                Insight Prioritas Tinggi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {highPriorityInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="p-4 rounded-xl bg-background border border-destructive/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      {insight.suggestedAction && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <ArrowRight className="w-4 h-4" />
                          <span>{insight.suggestedAction}</span>
                        </div>
                      )}
                    </div>
                    {insight.metric && (
                      <div className="text-right">
                        <span className="text-2xl font-bold">{insight.metric.value}</span>
                        <span className="text-sm text-muted-foreground ml-1">{insight.metric.unit}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Priority Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Wilayah Prioritas Intervensi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {priorityAreas.slice(0, 5).map((area, index) => (
                <motion.div
                  key={area.region}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`p-4 rounded-xl border ${
                    area.urgency === "critical" 
                      ? "border-destructive/30 bg-destructive/5" 
                      : area.urgency === "high"
                      ? "border-warning/30 bg-warning/5"
                      : "border-border/50 bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        area.urgency === "critical" ? "bg-destructive/20" :
                        area.urgency === "high" ? "bg-warning/20" : "bg-muted"
                      }`}>
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{area.region}</h4>
                        <p className="text-xs text-muted-foreground">
                          {area.population.toLocaleString()} populasi terdata
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      area.urgency === "critical" ? "bg-destructive/20 text-destructive" :
                      area.urgency === "high" ? "bg-warning/20 text-warning-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {area.urgency === "critical" ? "Kritis" : area.urgency === "high" ? "Tinggi" : "Sedang"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Skor Risiko</span>
                        <span className="font-medium">{area.riskScore}%</span>
                      </div>
                      <Progress 
                        value={area.riskScore} 
                        className={`h-1.5 ${
                          area.riskScore > 70 ? "[&>div]:bg-destructive" :
                          area.riskScore > 50 ? "[&>div]:bg-warning" :
                          "[&>div]:bg-success"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {area.needs.map((need, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {need}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Trends Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Tren Utama
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trends.map((trend, index) => {
                const changePercent = trend.previousValue > 0 
                  ? Math.round(((trend.currentValue - trend.previousValue) / trend.previousValue) * 100)
                  : 0;

                return (
                  <motion.div
                    key={trend.category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="p-4 rounded-xl bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{trend.category}</span>
                      <div className={`flex items-center gap-1 text-sm ${
                        trend.trend === "up" ? "text-destructive" :
                        trend.trend === "down" ? "text-success" :
                        "text-muted-foreground"
                      }`}>
                        {trend.trend === "up" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : trend.trend === "down" ? (
                          <TrendingUp className="w-4 h-4 rotate-180" />
                        ) : (
                          <span className="w-4 h-0.5 bg-current" />
                        )}
                        <span>{changePercent > 0 ? "+" : ""}{changePercent}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{trend.interpretation}</p>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Other Insights Grid */}
      {otherInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">Insight Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherInsights.slice(0, 6).map((insight, index) => {
                  const Icon = INSIGHT_ICONS[insight.type];
                  const color = INSIGHT_COLORS[insight.type];

                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-${color}/10 flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${color}`} />
                        </div>
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                      {insight.metric && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold">{insight.metric.value}</span>
                          <span className="text-xs text-muted-foreground">{insight.metric.unit}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Privacy & Ethics Notice */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Kepatuhan Etika & Privasi</p>
            <p>
              Seluruh insight dihasilkan dari data agregat anonim. Tidak ada informasi yang dapat 
              mengidentifikasi individu. Dashboard ini dirancang untuk mendukung pengambilan keputusan 
              kebijakan kesehatan mental berbasis bukti dengan tetap menjaga privasi pengguna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderInsightDashboard;
