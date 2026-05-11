import { motion } from "framer-motion";
import { Play, MessageCircle, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const demoSteps = [
  {
    question: "Dalam 2 minggu terakhir, seberapa sering Anda merasa sedih, tertekan, atau putus asa?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari separuh waktu", "Hampir setiap hari"],
    selected: 1,
  },
  {
    question: "Seberapa sering Anda merasa cemas atau khawatir berlebihan?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari separuh waktu", "Hampir setiap hari"],
    selected: 2,
  },
  {
    question: "Apakah Anda mengalami kesulitan tidur atau tidur terlalu banyak?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari separuh waktu", "Hampir setiap hari"],
    selected: 1,
  },
];

const demoResults = {
  riskLevel: "Sedang",
  score: 12,
  maxScore: 27,
  recommendations: [
    "Pertimbangkan konsultasi dengan profesional kesehatan mental",
    "Praktikkan teknik relaksasi dan mindfulness",
    "Jaga pola tidur yang teratur",
    "Tetap terhubung dengan orang-orang terdekat",
  ],
};

export const Demo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (activeStep < demoSteps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setShowResult(false);
  };

  return (
    <section id="demo" className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-4">
            <Play className="w-4 h-4 text-primary" />
            <span>Demo Interaktif</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Lihat Cara Kerja <span className="text-gradient">Skrining</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Coba simulasi singkat proses skrining kesehatan mental kami. 
            Ini hanya demo - data tidak disimpan.
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-xl border overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-muted/50 px-6 py-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {showResult ? "Hasil Skrining" : `Pertanyaan ${activeStep + 1} dari ${demoSteps.length}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {showResult ? "100%" : `${Math.round(((activeStep + 1) / demoSteps.length) * 100)}%`}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: "0%" }}
                  animate={{ width: showResult ? "100%" : `${((activeStep + 1) / demoSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {!showResult ? (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Question */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{demoSteps[activeStep].question}</p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pl-14">
                    {demoSteps[activeStep].options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          index === demoSteps[activeStep].selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              index === demoSteps[activeStep].selected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {index === demoSteps[activeStep].selected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className={index === demoSteps[activeStep].selected ? "font-medium" : ""}>
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNext} className="gap-2">
                      {activeStep < demoSteps.length - 1 ? "Selanjutnya" : "Lihat Hasil"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Result Header */}
                  <div className="text-center pb-6 border-b">
                    <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-10 h-10 text-warning" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Risiko {demoResults.riskLevel}</h3>
                    <p className="text-muted-foreground">
                      Skor: {demoResults.score}/{demoResults.maxScore}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-4">Rekomendasi:</h4>
                    <div className="space-y-3">
                      {demoResults.recommendations.map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{rec}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                      Ulangi Demo
                    </Button>
                    <Link to="/screening" className="flex-1">
                      <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary">
                        Mulai Skrining Nyata
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            * Ini adalah simulasi untuk tujuan demonstrasi. Skrining yang sebenarnya lebih komprehensif 
            dengan analisis AI untuk hasil yang akurat.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
