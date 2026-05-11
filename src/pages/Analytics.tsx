import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Activity, Calendar, ArrowUpRight, ArrowDownRight, Loader2, Shield, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CommunityResilienceIndex } from "@/components/analytics/CommunityResilienceIndex";
import { DisasterPhaseTagging } from "@/components/analytics/DisasterPhaseTagging";
import { StakeholderInsightDashboard } from "@/components/analytics/StakeholderInsightDashboard";

const COLORS = {
  success: "hsl(160, 84%, 39%)",
  warning: "hsl(38, 92%, 50%)",
  destructive: "hsl(0, 84%, 60%)",
  primary: "hsl(217, 91%, 50%)",
};

// Mock data for Society 5.0 features
const mockRegions = [
  { region: "Jakarta", resilienceScore: 72, totalScreenings: 1250, avgSentiment: 0.3, riskDistribution: { low: 60, medium: 28, high: 12 }, trend: "improving" as const },
  { region: "Jawa Barat", resilienceScore: 65, totalScreenings: 980, avgSentiment: 0.2, riskDistribution: { low: 55, medium: 30, high: 15 }, trend: "stable" as const },
  { region: "Jawa Tengah", resilienceScore: 58, totalScreenings: 720, avgSentiment: 0.1, riskDistribution: { low: 48, medium: 35, high: 17 }, trend: "improving" as const },
  { region: "Sulawesi Selatan", resilienceScore: 45, totalScreenings: 320, avgSentiment: -0.1, riskDistribution: { low: 40, medium: 35, high: 25 }, trend: "declining" as const },
  { region: "NTT", resilienceScore: 42, totalScreenings: 180, avgSentiment: -0.2, riskDistribution: { low: 35, medium: 38, high: 27 }, trend: "stable" as const },
];

const mockPhases = [
  { phase: "pra-bencana" as const, totalScreenings: 2500, avgAnxiety: 0.25, avgDepression: 0.2, avgSentiment: 0.4, riskDistribution: { low: 65, medium: 25, high: 10 }, dominantEmotions: ["Netral", "Cemas", "Harapan"], trend: "stable" as const },
  { phase: "tanggap-darurat" as const, totalScreenings: 1800, avgAnxiety: 0.65, avgDepression: 0.55, avgSentiment: -0.3, riskDistribution: { low: 25, medium: 40, high: 35 }, dominantEmotions: ["Kecemasan", "Ketakutan", "Stres"], trend: "declining" as const },
  { phase: "pascabencana" as const, totalScreenings: 2200, avgAnxiety: 0.4, avgDepression: 0.35, avgSentiment: 0.1, riskDistribution: { low: 45, medium: 35, high: 20 }, dominantEmotions: ["Harapan", "Kesedihan", "Netral"], trend: "improving" as const },
];

const mockInsights = [
  { id: "1", type: "alert" as const, title: "Lonjakan Kecemasan di Sulawesi Selatan", description: "Peningkatan 45% tingkat kecemasan dalam 7 hari terakhir memerlukan perhatian segera.", metric: { value: 45, unit: "%" }, priority: "high" as const, actionable: true, suggestedAction: "Deploy tim konseling mobile" },
  { id: "2", type: "priority" as const, title: "NTT Butuh Intervensi", description: "Skor ketahanan terendah dengan tren menurun.", priority: "high" as const, actionable: true, suggestedAction: "Prioritaskan alokasi sumber daya" },
  { id: "3", type: "trend" as const, title: "Perbaikan Pascabencana", description: "Wilayah pascabencana menunjukkan pemulihan bertahap.", metric: { value: 15, unit: "% improvement" }, priority: "medium" as const, actionable: false },
];

const mockPriorityAreas = [
  { region: "Sulawesi Selatan", riskScore: 78, population: 8500, needs: ["Konseling", "Hotline 24/7"], urgency: "critical" as const },
  { region: "NTT", riskScore: 72, population: 5200, needs: ["Pelatihan relawan", "Obat-obatan"], urgency: "high" as const },
  { region: "Maluku", riskScore: 58, population: 3100, needs: ["Edukasi"], urgency: "moderate" as const },
];

const mockTrends = [
  { category: "Tingkat Kecemasan", currentValue: 35, previousValue: 30, trend: "up" as const, interpretation: "Peningkatan kecemasan perlu dipantau" },
  { category: "Akses Layanan", currentValue: 68, previousValue: 55, trend: "down" as const, interpretation: "Lebih banyak orang mengakses bantuan" },
  { category: "Risiko Tinggi", currentValue: 18, previousValue: 22, trend: "down" as const, interpretation: "Penurunan kasus risiko tinggi" },
];

const Analytics = () => {
  const { summary, dailyData, loading } = useAnalytics();

  const pieData = summary
    ? [
        { name: "Risiko Rendah", value: summary.lowRisk, color: COLORS.success },
        { name: "Risiko Sedang", value: summary.mediumRisk, color: COLORS.warning },
        { name: "Risiko Tinggi", value: summary.highRisk, color: COLORS.destructive },
      ].filter((d) => d.value > 0)
    : [];

  const chartData = dailyData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    screening: d.screenings,
    risiko: d.highRisk + d.mediumRisk,
  }));

  const stats = [
    { title: "Total Skrining", value: summary?.totalScreenings?.toLocaleString() || "0", change: "+12.5%", isPositive: true, icon: BarChart3, color: "from-primary to-primary/70" },
    { title: "Pengguna Unik", value: summary?.uniqueUsers?.toLocaleString() || "0", change: "+8.2%", isPositive: true, icon: Users, color: "from-secondary to-secondary/70" },
    { title: "Risiko Rendah", value: summary?.lowRisk?.toLocaleString() || "0", change: summary?.totalScreenings ? `${((summary.lowRisk / summary.totalScreenings) * 100).toFixed(1)}%` : "0%", isPositive: true, icon: Activity, color: "from-success to-success/70" },
    { title: "Risiko Tinggi", value: summary?.highRisk?.toLocaleString() || "0", change: summary?.totalScreenings ? `${((summary.highRisk / summary.totalScreenings) * 100).toFixed(1)}%` : "0%", isPositive: false, icon: Calendar, color: "from-destructive to-destructive/70" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data analitik...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Dashboard Analitik Society 5.0</span>
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">Analitik <span className="text-gradient">Kesehatan Mental</span></h1>
          <p className="text-muted-foreground">Pantau tren, ketahanan komunitas, dan wawasan berbasis data untuk pengambilan keputusan</p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="resilience">Ketahanan Komunitas</TabsTrigger>
            <TabsTrigger value="disaster">Fase Bencana</TabsTrigger>
            <TabsTrigger value="insights">Stakeholder Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                          <p className="text-3xl font-display font-bold">{stat.value}</p>
                          <div className={`flex items-center gap-1 mt-2 text-sm ${stat.isPositive ? "text-success" : "text-destructive"}`}>
                            {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span>{stat.change}</span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-border/50">
                <CardHeader><CardTitle className="text-lg font-display">Tren Skrining</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorScreening" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                          <XAxis dataKey="date" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                          <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 32%, 91%)", borderRadius: "12px" }} />
                          <Area type="monotone" dataKey="screening" stroke={COLORS.primary} strokeWidth={2} fill="url(#colorScreening)" name="Total Skrining" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">Belum ada data</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg font-display">Distribusi Risiko</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">{pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><Tooltip /></PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-muted-foreground">{item.name}</span></div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resilience">
            <CommunityResilienceIndex regions={mockRegions} nationalAverage={58} />
          </TabsContent>

          <TabsContent value="disaster">
            <DisasterPhaseTagging phases={mockPhases} currentPhase="pascabencana" />
          </TabsContent>

          <TabsContent value="insights">
            <StakeholderInsightDashboard insights={mockInsights} priorityAreas={mockPriorityAreas} trends={mockTrends} lastUpdated={new Date().toISOString()} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
