import { motion } from "framer-motion";
import { UserPlus, MessageSquare, Brain, FileCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Registrasi & Masuk",
    description: "Buat akun atau masuk ke akun Anda untuk memulai proses skrining yang terpersonalisasi",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Ekspresikan Perasaan",
    description: "Tuliskan pengalaman atau perasaan Anda dalam bentuk percakapan alami melalui chat interaktif",
  },
  {
    number: "03",
    icon: Brain,
    title: "Analisis AI",
    description: "Sistem menganalisis teks menggunakan model machine learning dan NLP untuk memahami kondisi emosional",
  },
  {
    number: "04",
    icon: FileCheck,
    title: "Hasil & Rekomendasi",
    description: "Dapatkan penilaian risiko dan rekomendasi tindakan yang sesuai berdasarkan analisis mendalam",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Cara Kerja <span className="text-gradient">SAPA-JIWA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proses sederhana untuk memulai perjalanan kesehatan mental Anda
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/30 hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex gap-6 md:gap-8"
                >
                  {/* Step Number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <span className="text-lg font-display font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex w-12 h-12 rounded-xl bg-accent items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
