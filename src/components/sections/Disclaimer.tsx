import { motion } from "framer-motion";
import { AlertTriangle, Phone } from "lucide-react";

export const Disclaimer = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-10 rounded-3xl border-2 border-warning/30 bg-warning/5"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Pernyataan Etis Penting
            </h3>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                SAPA-JIWA adalah alat skrining awal dan bukan pengganti diagnosis medis profesional.
              </strong>{" "}
              Hasil yang diberikan bersifat indikatif berdasarkan analisis pola bahasa. 
              Untuk diagnosis dan penanganan yang tepat, konsultasikan dengan profesional kesehatan mental.
            </p>

            {/* Emergency Contact */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Darurat Kesehatan Jiwa: 1198
                </p>
                <p className="text-sm text-muted-foreground">
                  Layanan 24 jam tersedia
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
