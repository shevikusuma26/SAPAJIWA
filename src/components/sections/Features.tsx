import { motion } from "framer-motion";
import { Bot, Brain, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Analisis Bahasa Alami",
    description: "Menggunakan NLP canggih untuk memahami emosi dan pola pikir dari teks percakapan dengan akurasi tinggi",
    color: "from-primary to-primary/70",
  },
  {
    icon: Brain,
    title: "Skrining Adaptif",
    description: "Kuesioner yang menyesuaikan pertanyaan secara real-time berdasarkan respons pengguna",
    color: "from-secondary to-secondary/70",
  },
  {
    icon: Shield,
    title: "Privasi & Keamanan",
    description: "Data dienkripsi end-to-end dan dianonimisasi untuk melindungi identitas pengguna sepenuhnya",
    color: "from-success to-success/70",
  },
  {
    icon: BarChart3,
    title: "Analitik Real-time",
    description: "Dashboard analitik dengan visualisasi data untuk pemahaman mendalam tentang tren kesehatan mental",
    color: "from-warning to-warning/70",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Fitur <span className="text-gradient">Utama</span> Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Teknologi terdepan untuk mendukung kesehatan mental Anda
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-display font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
