import { motion } from "framer-motion";
import { UserPlus, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Siap Memulai Perjalanan Kesehatan Mental Anda?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Bergabunglah dengan ribuan pengguna yang telah memperoleh wawasan tentang kesehatan mental mereka
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Daftar Sekarang
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Book className="w-5 h-5" />
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
