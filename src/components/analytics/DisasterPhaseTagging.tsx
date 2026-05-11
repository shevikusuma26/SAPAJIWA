import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Clock, 
  RefreshCcw, 
  Shield,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

type DisasterPhase = "pra-bencana" | "tanggap-darurat" | "pascabencana";

interface PhaseData {
  phase: DisasterPhase;
  totalScreenings: number;
  avgAnxiety: number;
  avgDepression: number;
  avgSentiment: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  dominantEmotions: string[];
  trend: "improving" | "declining" | "stable";
}

interface DisasterPhaseTaggingProps {
  phases: PhaseData[];
  currentPhase?: DisasterPhase;
}

const PHASE_CONFIG: Record<DisasterPhase, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
}> = {
  "pra-bencana": {
    label: "Pra-Bencana",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Fase kesiapsiagaan dan mitigasi risiko"
  },
  "tanggap-darurat": {
    label: "Tanggap Darurat",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    description: "Fase respons aktif terhadap bencana"
  },
  "pascabencana": {
    label: "Pascabencana",
    icon: RefreshCcw,
    color: "text-success",
    bgColor: "bg-success/10",
    description: "Fase pemulihan dan rekonstruksi"
  }
};

export const DisasterPhaseTagging = ({
  phases,
  currentPhase
}: DisasterPhaseTaggingProps) => {
  // Prepare comparison chart data
  const comparisonData = phases.map(phase => ({
    phase: PHASE_CONFIG[phase.phase].label,
    Kecemasan: Math.round(phase.avgAnxiety * 100),
    Depresi: Math.round(phase.avgDepression * 100),
    "Risiko Tinggi": phase.riskDistribution.high,
  }));

  // Prepare radar data for mental health dimensions
  const radarData = phases.map(phase => ({
    phase: PHASE_CONFIG[phase.phase].label,
    "Kecemasan": phase.avgAnxiety * 100,
    "Depresi": phase.avgDepression * 100,
    "Sentimen Negatif": (1 - ((phase.avgSentiment + 1) / 2)) * 100,
    "Risiko Tinggi": phase.riskDistribution.high,
    "Risiko Sedang": phase.riskDistribution.medium,
  }));

  return (
    <div className="space-y-6">
      {/* Phase Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {phases.map((phase, index) => {
          const config = PHASE_CONFIG[phase.phase];
          const Icon = config.icon;
          const isCurrentPhase = phase.phase === currentPhase;

          return (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`border-2 transition-all ${
                isCurrentPhase 
                  ? "border-primary shadow-lg" 
                  : "border-border/50 hover:border-primary/30"
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{config.label}</h3>
                      {isCurrentPhase && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Fase Saat Ini
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{config.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Skrining</span>
                      <span className="font-medium">{phase.totalScreenings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risiko Tinggi</span>
                      <span className="font-medium text-destructive">{phase.riskDistribution.high}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tren</span>
                      <div className="flex items-center gap-1">
                        {phase.trend === "improving" ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : phase.trend === "declining" ? (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        ) : (
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${
                          phase.trend === "improving" ? "text-success" :
                          phase.trend === "declining" ? "text-destructive" :
                          "text-muted-foreground"
                        }`}>
                          {phase.trend === "improving" ? "Membaik" :
                           phase.trend === "declining" ? "Menurun" : "Stabil"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dominant Emotions */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Emosi Dominan:</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.dominantEmotions.slice(0, 3).map((emotion, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Perbandingan Antar Fase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="phase" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                      formatter={(value: number) => [`${value}%`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="Kecemasan" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Depresi" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Risiko Tinggi" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Profil Kesehatan Mental per Fase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: "Kecemasan", ...Object.fromEntries(radarData.map(r => [r.phase, r["Kecemasan"]])) },
                    { subject: "Depresi", ...Object.fromEntries(radarData.map(r => [r.phase, r["Depresi"]])) },
                    { subject: "Sentimen Negatif", ...Object.fromEntries(radarData.map(r => [r.phase, r["Sentimen Negatif"]])) },
                    { subject: "Risiko Tinggi", ...Object.fromEntries(radarData.map(r => [r.phase, r["Risiko Tinggi"]])) },
                  ]}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="Pra-Bencana"
                      dataKey="Pra-Bencana"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Tanggap Darurat"
                      dataKey="Tanggap Darurat"
                      stroke="hsl(0, 84%, 60%)"
                      fill="hsl(0, 84%, 60%)"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Pascabencana"
                      dataKey="Pascabencana"
                      stroke="hsl(160, 84%, 39%)"
                      fill="hsl(160, 84%, 39%)"
                      fillOpacity={0.2}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-muted-foreground p-4 rounded-xl bg-muted/30">
        <Shield className="w-4 h-4 inline-block mr-2" />
        Analisis berbasis data agregat untuk mendukung kebijakan tanggap bencana. Tidak menampilkan data individu.
      </div>
    </div>
  );
};

export default DisasterPhaseTagging;