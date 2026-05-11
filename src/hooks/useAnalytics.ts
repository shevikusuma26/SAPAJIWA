import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AnalyticsSummary {
  totalScreenings: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  avgSentiment: number;
  uniqueUsers: number;
}

interface DailyAnalytics {
  date: string;
  screenings: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}

export function useAnalytics() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailyData, setDailyData] = useState<DailyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Require authentication for analytics
      if (!user) {
        setError("Silakan masuk untuk melihat analitik");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch summary using the database function
        const { data: summaryData, error: summaryError } = await supabase.rpc(
          "get_analytics_summary"
        );

        if (summaryError) {
          console.error("Summary error:", summaryError);
          if (summaryError.message?.includes("Authentication required")) {
            setError("Autentikasi diperlukan untuk melihat analitik");
            return;
          }
        } else if (summaryData && summaryData.length > 0) {
          const row = summaryData[0];
          setSummary({
            totalScreenings: Number(row.total_screenings) || 0,
            lowRisk: Number(row.low_risk) || 0,
            mediumRisk: Number(row.medium_risk) || 0,
            highRisk: Number(row.high_risk) || 0,
            avgSentiment: Number(row.avg_sentiment) || 0,
            uniqueUsers: Number(row.unique_users) || 0,
          });
        }

        // Fetch daily data using the database function
        const { data: dailyRaw, error: dailyError } = await supabase.rpc(
          "get_daily_analytics",
          { days_back: 30 }
        );

        if (dailyError) {
          console.error("Daily error:", dailyError);
        } else if (dailyRaw) {
          setDailyData(
            dailyRaw.map((row: { date: string; screenings: number; low_risk: number; medium_risk: number; high_risk: number }) => ({
              date: row.date,
              screenings: Number(row.screenings) || 0,
              lowRisk: Number(row.low_risk) || 0,
              mediumRisk: Number(row.medium_risk) || 0,
              highRisk: Number(row.high_risk) || 0,
            }))
          );
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat analitik");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  return { summary, dailyData, loading, error };
}
