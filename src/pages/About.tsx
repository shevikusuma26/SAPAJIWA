import { motion } from "framer-motion";
import { 
  Info, Target, Award, Heart, Shield, Brain, Sparkles, 
  Globe, BookOpen, Languages, BarChart2, Bot, Cog, 
  Users, FileText, Database, Lightbulb
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    icon: Heart,
    title: "Empati",
    description: "Kami memahami bahwa setiap individu memiliki cerita unik dan memerlukan pendekatan yang personal.",
  },
  {
    icon: Shield,
    title: "Privasi",
    description: "Keamanan dan kerahasiaan data pengguna adalah prioritas utama dalam setiap aspek platform.",
  },
  {
    icon: Brain,
    title: "Inovasi",
    description: "Menggunakan teknologi AI terdepan untuk memberikan skrining yang akurat dan terpercaya.",
  },
  {
    icon: Sparkles,
    title: "Aksesibilitas",
    description: "Memastikan layanan kesehatan mental dapat diakses oleh semua kalangan masyarakat.",
  },
];

const techFeatures = [
  {
    icon: Languages,
    title: "Analisis Pola Linguistik",
    description: "Mengidentifikasi pola bahasa yang berkorelasi dengan kondisi psikologis tertentu",
  },
  {
    icon: BarChart2,
    title: "Deteksi Emosi Otomatis",
    description: "Menganalisis sentimen dan emosi dari teks percakapan alami",
  },
  {
    icon: Bot,
    title: "Klasifikasi Risiko Adaptif",
    description: "Model machine learning yang terus belajar dari data untuk meningkatkan akurasi",
  },
];

const methodologySteps = [
  { icon: FileText, title: "Pengumpulan Data", description: "Input teks pengguna melalui interface yang aman dan empatik" },
  { icon: Cog, title: "Preprocessing NLP", description: "Pembersihan teks, tokenisasi, dan normalisasi" },
  { icon: Database, title: "Ekstraksi Fitur", description: "Analisis sentimen, deteksi emosi, dan ekstraksi pola linguistik" },
  { icon: Brain, title: "Klasifikasi Risiko", description: "Model machine learning mengkategorikan tingkat risiko psikologis" },
  { icon: Lightbulb, title: "Rekomendasi", description: "Generasi rekomendasi tindak lanjut yang sesuai" },
];


const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 gradient-bg">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-6">
                <Info className="w-4 h-4 text-primary" />
                <span>Tentang Kami</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Tentang <span className="text-gradient">SAPA-JIWA</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Platform Inovatif untuk Skrining Kesehatan Mental Pascabencana
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-4">Misi Kami</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Menyediakan alat skrining kesehatan mental yang mudah diakses, akurat, dan 
                  berbasis empati untuk membantu penyintas bencana mendapatkan dukungan yang 
                  mereka butuhkan dengan menjaga privasi dan martabat mereka.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-gradient-to-br from-secondary/10 to-success/10 border border-secondary/20"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-success flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-4">Visi Kami</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi platform terdepan dalam skrining kesehatan mental yang mengintegrasikan 
                  teknologi AI dan pendekatan humanis untuk mendukung pencapaian SDGs 3 
                  (Kesehatan dan Kesejahteraan) dalam kerangka Society 5.0.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SDG Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold">
                  Kontribusi terhadap <span className="text-gradient">SDGs</span>
                </h2>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* SDG 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl bg-success/10 border border-success/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center text-white font-display font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-display font-bold">SDG 3</h3>
                    <p className="text-sm text-muted-foreground">Good Health and Well-being</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    Skrining dini gangguan mental pascabencana
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    Peningkatan akses layanan kesehatan mental
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    Promosi kesejahteraan psikologis
                  </li>
                </ul>
              </motion.div>

              {/* SDG 16 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-3xl bg-primary/10 border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-display font-bold">
                    16
                  </div>
                  <div>
                    <h3 className="font-display font-bold">SDG 16</h3>
                    <p className="text-sm text-muted-foreground">Peace, Justice and Strong Institutions</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Sistem pendukung keputusan berbasis data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Transparansi dalam intervensi psikososial
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Penguatan kapasitas institusi kesehatan
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-20 bg-muted/50">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cog className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold">
                  Metodologi & <span className="text-gradient">Kerangka Kerja</span>
                </h2>
              </div>
            </motion.div>

            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-secondary to-success hidden md:block" />

              <div className="space-y-6">
                {methodologySteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6"
                    >
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-display font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <h3 className="font-display font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Nilai-Nilai <span className="text-gradient">Kami</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Prinsip yang mendasari setiap aspek pengembangan SAPA-JIWA
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg text-center group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-accent mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Tim <span className="text-gradient">Ahli</span> Kami
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Profesional berpengalaman di bidang AI, psikologi, dan kesehatan mental
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { role: "AI Research Lead", expertise: "NLP & Machine Learning" },
                { role: "Clinical Psychologist", expertise: "Trauma & PTSD" },
                { role: "Data Scientist", expertise: "Mental Health Analytics" },
                { role: "UX Researcher", expertise: "Healthcare Design" },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border/50 text-center group hover:border-primary/30 transition-all hover:shadow-lg"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold mb-1">{member.role}</h3>
                  <p className="text-sm text-muted-foreground">{member.expertise}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
