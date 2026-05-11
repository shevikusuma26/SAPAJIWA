import { Link } from "react-router-dom";
import { Heart, Phone, Globe, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-display font-bold">SAPA-JIWA</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform skrining kesehatan mental berbasis AI untuk mendukung 
              SDGs 3 dan 16 dalam kerangka Society 5.0
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/screening" className="hover:text-primary transition-colors">
                  Skrining
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-primary transition-colors">
                  Analitik
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Tentang
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Kontak Darurat</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>1198 - Kesehatan Jiwa</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-destructive" />
                <span>112 - Darurat Nasional</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-secondary" />
                <span>intohelpline.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
          <p>
            © 2026 SAPA-JIWA. Seluruh hak cipta dilindungi. 
            <span className="hidden sm:inline"> | Platform ini dikembangkan dengan prinsip etika AI dan perlindungan data</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
