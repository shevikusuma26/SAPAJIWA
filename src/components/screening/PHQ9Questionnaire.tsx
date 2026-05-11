import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, ClipboardList, AlertTriangle, CheckCircle, Info } from "lucide-react";

const PHQ9_QUESTIONS = [
  "Kurang berminat atau kurang menikmati dalam melakukan sesuatu",
  "Merasa sedih, murung, atau putus asa",
  "Sulit tidur atau tetap tertidur, atau terlalu banyak tidur",
  "Merasa lelah atau kurang berenergi",
  "Kurang nafsu makan atau makan berlebihan",
  "Merasa buruk tentang diri sendiri — atau merasa diri gagal atau telah mengecewakan diri sendiri atau keluarga",
  "Sulit berkonsentrasi pada sesuatu, seperti membaca koran atau menonton TV",
  "Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikan. Atau sebaliknya — sangat gelisah sehingga bergerak lebih dari biasanya",
  "Berpikir akan lebih baik jika mati, atau ingin menyakiti diri sendiri dengan cara apapun",
];

const ANSWER_OPTIONS = [
  { value: 0, label: "Tidak pernah" },
  { value: 1, label: "Beberapa hari" },
  { value: 2, label: "Lebih dari separuh waktu" },
  { value: 3, label: "Hampir setiap hari" },
];

interface PHQ9QuestionnaireProps {
  onComplete: (score: number, answers: number[]) => void;
  onCancel: () => void;
}

export function PHQ9Questionnaire({ onComplete, onCancel }: PHQ9QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(9).fill(null));

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
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

  const progress = ((currentQuestion + 1) / PHQ9_QUESTIONS.length) * 100;

  const getSeverity = (score: number) => {
    if (score <= 4) return { label: "Minimal", color: "text-success", icon: CheckCircle };
    if (score <= 9) return { label: "Ringan", color: "text-warning", icon: Info };
    if (score <= 14) return { label: "Sedang", color: "text-warning", icon: AlertTriangle };
    if (score <= 19) return { label: "Cukup Berat", color: "text-destructive", icon: AlertTriangle };
    return { label: "Berat", color: "text-destructive", icon: AlertTriangle };
  };

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="font-display">Kuesioner PHQ-9</CardTitle>
                <CardDescription>Skrining Depresi Standar</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Batal
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pertanyaan {currentQuestion + 1} dari {PHQ9_QUESTIONS.length}</span>
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
              {PHQ9_QUESTIONS[currentQuestion]}
            </motion.p>
          </div>

          <RadioGroup
            key={`phq9-question-${currentQuestion}`}
            value={answers[currentQuestion]?.toString() ?? ""}
            onValueChange={(val) => handleAnswer(parseInt(val))}
            className="space-y-3"
          >
            {ANSWER_OPTIONS.map((option) => (
              <motion.div
                key={`phq9-${currentQuestion}-${option.value}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={`phq9-${currentQuestion}-${option.value}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    answers[currentQuestion] === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value={option.value.toString()} id={`phq9-${currentQuestion}-${option.value}`} />
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
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {currentQuestion === PHQ9_QUESTIONS.length - 1 ? "Selesai" : "Selanjutnya"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function getPHQ9Interpretation(score: number) {
  if (score <= 4) {
    return {
      severity: "Minimal",
      riskLevel: "rendah",
      description: "Gejala depresi minimal atau tidak ada. Tetap jaga kesehatan mental Anda.",
      recommendations: [
        { type: "info", title: "Pertahankan Gaya Hidup Sehat", description: "Lanjutkan aktivitas yang membuat Anda bahagia" },
        { type: "info", title: "Olahraga Teratur", description: "Aktivitas fisik dapat membantu menjaga mood" },
      ],
    };
  }
  if (score <= 9) {
    return {
      severity: "Ringan",
      riskLevel: "rendah",
      description: "Gejala depresi ringan terdeteksi. Pertimbangkan untuk memantau kondisi Anda.",
      recommendations: [
        { type: "info", title: "Pantau Kondisi", description: "Perhatikan perubahan mood dalam beberapa minggu ke depan" },
        { type: "info", title: "Self-Care", description: "Tingkatkan aktivitas yang memberikan kesenangan" },
        { type: "info", title: "Berbicara", description: "Ceritakan perasaan Anda kepada orang terdekat" },
      ],
    };
  }
  if (score <= 14) {
    return {
      severity: "Sedang",
      riskLevel: "sedang",
      description: "Gejala depresi sedang terdeteksi. Disarankan untuk berkonsultasi dengan profesional.",
      recommendations: [
        { type: "urgent", title: "Konsultasi Profesional", description: "Pertimbangkan untuk menemui psikolog atau konselor" },
        { type: "info", title: "Dukungan Sosial", description: "Jangan isolasi diri, tetap terhubung dengan orang terdekat" },
        { type: "info", title: "Rutinitas Harian", description: "Jaga pola tidur dan makan yang teratur" },
      ],
    };
  }
  if (score <= 19) {
    return {
      severity: "Cukup Berat",
      riskLevel: "tinggi",
      description: "Gejala depresi cukup berat. Sangat disarankan untuk segera berkonsultasi dengan profesional.",
      recommendations: [
        { type: "urgent", title: "Segera Konsultasi", description: "Jadwalkan pertemuan dengan psikolog atau psikiater" },
        { type: "urgent", title: "Jangan Sendiri", description: "Ceritakan kondisi Anda kepada keluarga atau teman terdekat" },
        { type: "info", title: "Hotline", description: "Hubungi 1198 jika membutuhkan dukungan segera" },
      ],
    };
  }
  return {
    severity: "Berat",
    riskLevel: "tinggi",
    description: "Gejala depresi berat terdeteksi. Diperlukan penanganan segera dari profesional kesehatan mental.",
    recommendations: [
      { type: "urgent", title: "Penanganan Segera", description: "Segera hubungi psikiater atau kunjungi fasilitas kesehatan" },
      { type: "urgent", title: "Jangan Sendirian", description: "Tetap bersama orang yang Anda percaya" },
      { type: "urgent", title: "Hotline Darurat", description: "Hubungi 1198 (Hotline Kesehatan Jiwa) atau 112 (Darurat)" },
    ],
  };
}
