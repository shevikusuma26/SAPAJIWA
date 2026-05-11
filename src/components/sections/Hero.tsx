import { motion } from "framer-motion";
import { ArrowRight, Play, Brain, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-bg overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Berbasis AI & NLP</span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Dukungan{" "}
              <span className="text-gradient">Kesehatan Mental</span>{" "}
              untuk Penyintas Bencana
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Platform skrining dini berbasis AI yang mengintegrasikan Natural Language Processing 
              dan Machine Learning untuk deteksi risiko psikologis dengan pendekatan empatik 
              dan terjamin kerahasiaannya.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/screening">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">
                  <Play className="w-5 h-5" />
                  Mulai Skrining Gratis
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="outline" size="lg" className="gap-2 border-2">
                  Lihat Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-success" />
                <span>Data Terenkripsi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="w-5 h-5 text-primary" />
                <span>AI Akurat</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[400px] h-[400px]">
              {/* Animated Circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border-2 border-dashed border-secondary/20"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 rounded-full border-2 border-dashed border-primary/30"
              />
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl"
                >
                  <Brain className="w-20 h-20 text-white" />
                </motion.div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center"
              >
                <Shield className="w-8 h-8 text-success" />
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-10 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-warning" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
