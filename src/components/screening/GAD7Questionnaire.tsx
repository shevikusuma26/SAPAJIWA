import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, ClipboardCheck, AlertTriangle, CheckCircle, Info } from "lucide-react";

const GAD7_QUESTIONS = [
  "Merasa gugup, cemas, atau gelisah",
  "Tidak mampu menghentikan atau mengendalikan kekhawatiran",
  "Terlalu khawatir tentang berbagai hal",
  "Sulit untuk rileks",
  "Sangat gelisah sehingga sulit untuk duduk diam",
  "Menjadi mudah tersinggung atau mudah marah",
  "Merasa takut seolah-olah sesuatu yang buruk akan terjadi",
];

const ANSWER_OPTIONS = [
  { value: 0, label: "Tidak pernah" },
  { value: 1, label: "Beberapa hari" },
  { value: 2, label: "Lebih dari separuh waktu" },
  { value: 3, label: "Hampir setiap hari" },
];

interface GAD7QuestionnaireProps {
  onComplete: (score: number, answers: number[]) => void;
  onCancel: () => void;
}

export function GAD7Questionnaire({ onComplete, onCancel }: GAD7QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(7).fill(null));

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < GAD7_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);
      onComplete(totalScore, answers as number[]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / GAD7_QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-border/50 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="font-display">Kuesioner GAD-7</CardTitle>
                <CardDescription>Skrining Kecemasan Standar</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Batal
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pertanyaan {currentQuestion + 1} dari {GAD7_QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">
              Dalam 2 minggu terakhir, seberapa sering Anda merasa terganggu oleh:
            </p>
            <motion.p
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-medium"
            >
              {GAD7_QUESTIONS[currentQuestion]}
            </motion.p>
          </div>

          <RadioGroup
            key={`gad7-question-${currentQuestion}`}
            value={answers[currentQuestion]?.toString() ?? ""}
            onValueChange={(val) => handleAnswer(parseInt(val))}
            className="space-y-3"
          >
            {ANSWER_OPTIONS.map((option) => (
              <motion.div
                key={`gad7-${currentQuestion}-${option.value}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={`gad7-${currentQuestion}-${option.value}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    answers[currentQuestion] === option.value
                      ? "border-secondary bg-secondary/5"
                      : "border-border/50 hover:border-secondary/30 hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value={option.value.toString()} id={`gad7-${currentQuestion}-${option.value}`} />
                  <span className="font-medium">{option.label}</span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === null}
              className="gap-2 bg-gradient-to-r from-secondary to-primary hover:opacity-90"
            >
              {currentQuestion === GAD7_QUESTIONS.length - 1 ? "Selesai" : "Selanjutnya"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function getGAD7Interpretation(score: number) {
  if (score <= 4) {
    return {
      severity: "Minimal",
      riskLevel: "rendah",
      description: "Tingkat kecemasan minimal atau tidak ada. Kondisi baik.",
      recommendations: [
        { type: "info", title: "Pertahankan Keseimbangan", description: "Lanjutkan aktivitas relaksasi yang rutin" },
        { type: "info", title: "Mindfulness", description: "Praktikkan teknik pernapasan atau meditasi" },
      ],
    };
  }
  if (score <= 9) {
    return {
      severity: "Ringan",
      riskLevel: "rendah",
      description: "Tingkat kecemasan ringan terdeteksi. Pantau kondisi Anda.",
      recommendations: [
        { type: "info", title: "Teknik Relaksasi", description: "Coba latihan pernapasan dalam atau meditasi" },
        { type: "info", title: "Aktivitas Fisik", description: "Olahraga teratur dapat mengurangi kecemasan" },
        { type: "info", title: "Istirahat Cukup", description: "Pastikan tidur yang berkualitas" },
      ],
    };
  }
  if (score <= 14) {
    return {
      severity: "Sedang",
      riskLevel: "sedang",
      description: "Tingkat kecemasan sedang terdeteksi. Pertimbangkan untuk berkonsultasi.",
      recommendations: [
        { type: "urgent", title: "Konsultasi Profesional", description: "Pertimbangkan untuk menemui psikolog atau konselor" },
        { type: "info", title: "Identifikasi Pemicu", description: "Kenali situasi yang memicu kecemasan" },
        { type: "info", title: "Teknik Grounding", description: "Praktikkan teknik 5-4-3-2-1 saat cemas" },
      ],
    };
  }
  return {
    severity: "Berat",
    riskLevel: "tinggi",
    description: "Tingkat kecemasan berat terdeteksi. Sangat disarankan untuk berkonsultasi dengan profesional.",
    recommendations: [
      { type: "urgent", title: "Segera Konsultasi", description: "Jadwalkan pertemuan dengan psikolog atau psikiater" },
      { type: "urgent", title: "Dukungan Segera", description: "Ceritakan kondisi Anda kepada orang terdekat" },
      { type: "info", title: "Hotline", description: "Hubungi 1198 jika membutuhkan dukungan segera" },
    ],
  };
}
