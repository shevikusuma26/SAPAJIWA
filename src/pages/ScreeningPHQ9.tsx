import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PHQ9Questionnaire, getPHQ9Interpretation } from "@/components/screening/PHQ9Questionnaire";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ScreeningPHQ9 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (score: number, answers: number[]) => {
    setIsSubmitting(true);
    
    try {
      const interpretation = getPHQ9Interpretation(score);
      
      // Generate session token for anonymous users
      const sessionToken = !user ? crypto.randomUUID() : null;
      
      const { data, error } = await supabase
        .from("screening_results")
        .insert({
          user_id: user?.id || null,
          screening_type: "phq9",
          responses: answers.map((answer, index) => ({
            question: index + 1,
            answer,
          })),
          risk_level: interpretation.riskLevel,
          confidence: 1.0,
          sentiment_score: 1 - (score / 27), // Normalize to -1 to 1 scale
          dominant_emotion: score >= 15 ? "sadness" : score >= 10 ? "anxiety" : "neutral",
          recommendations: interpretation.recommendations,
          is_anonymous: !user,
          session_token: sessionToken,
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Hasil PHQ-9 berhasil disimpan");
      
      if (data?.id) {
        // Store session token in localStorage for anonymous access
        if (sessionToken) {
          localStorage.setItem(`screening_token_${data.id}`, sessionToken);
        }
        navigate(`/screening/result/${data.id}`);
      }
    } catch (error) {
      console.error("Error saving PHQ-9 result:", error);
      toast.error("Gagal menyimpan hasil. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/screening");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/screening">
              <Button variant="ghost" size="sm" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Skrining
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-4">
                <ClipboardList className="w-4 h-4 text-primary" />
                <span>Kuesioner Standar PHQ-9</span>
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Skrining <span className="text-gradient">Depresi</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Patient Health Questionnaire-9 (PHQ-9) adalah alat skrining standar untuk mengukur
                tingkat keparahan gejala depresi dalam 2 minggu terakhir.
              </p>
            </div>
          </motion.div>

          {/* Questionnaire */}
          <PHQ9Questionnaire 
            onComplete={handleComplete} 
            onCancel={handleCancel} 
          />

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Menyimpan hasil...</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScreeningPHQ9;
