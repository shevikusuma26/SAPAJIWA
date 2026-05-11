import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User, Shield, AlertCircle, Trash2, AlertTriangle, CheckCircle, Info, FileText, ClipboardList, ClipboardCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScreening } from "@/hooks/useScreening";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
const Screening = () => {
  const { messages, isLoading, analysis, lastResultId, sendMessage, clearConversation, finishScreening } = useScreening();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "tinggi":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "sedang":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-success/20 text-success border-success/30";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "tinggi":
        return <AlertTriangle className="w-4 h-4" />;
      case "sedang":
        return <Info className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-sm font-medium text-accent-foreground mb-4">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Skrining Interaktif dengan AI</span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Ceritakan <span className="text-gradient">Perasaan</span> Anda
            </h1>
            <p className="text-muted-foreground">
              {user
                ? "Chat dengan AI kami secara aman dan rahasia, atau gunakan kuesioner standar."
                : "Chat secara anonim atau gunakan kuesioner PHQ-9/GAD-7 untuk skrining terstruktur."}
            </p>
          </motion.div>

          {/* Login Prompt */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-accent/50 border border-primary/20 mb-6"
            >
              <p className="text-sm text-muted-foreground">
                Masuk untuk menyimpan riwayat skrining dan melihat progress Anda.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Masuk
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Questionnaire Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-4 mb-6"
          >
            <Link to="/screening/phq9">
              <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kuesioner PHQ-9</h3>
                    <p className="text-sm text-muted-foreground">Skrining depresi standar</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/screening/gad7">
              <Card className="h-full border-border/50 hover:border-secondary/50 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ClipboardCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kuesioner GAD-7</h3>
                    <p className="text-sm text-muted-foreground">Skrining kecemasan standar</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20 mb-6"
          >
            <Shield className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Percakapan Anda dienkripsi dan diproses secara aman. Data tidak akan dibagikan kepada pihak ketiga.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden flex flex-col"
            >
              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="h-[500px] overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.sender === "bot"
                            ? "bg-gradient-to-br from-primary to-secondary"
                            : "bg-muted"
                        }`}
                      >
                        {message.sender === "bot" ? (
                          <Bot className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          message.sender === "bot"
                            ? "bg-muted"
                            : "bg-gradient-to-r from-primary to-secondary text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-muted p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border/50 p-4 flex-shrink-0">
                <div className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSend();
                      }
                    }}
                    placeholder="Tulis perasaan atau pengalaman Anda di sini..."
                    className="min-h-[60px] max-h-[120px] resize-none rounded-xl border-border/50 focus:border-primary/50"
                    disabled={isLoading}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="h-auto flex-1 px-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={clearConversation}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analysis Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Risk Assessment */}
              {analysis && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display">Hasil Analisis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`p-4 rounded-xl border ${getRiskColor(analysis.riskLevel)}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getRiskIcon(analysis.riskLevel)}
                        <span className="font-medium capitalize">
                          Risiko {analysis.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm opacity-80">
                        Kepercayaan: {(analysis.confidence * 100).toFixed(0)}%
                      </p>
                    </div>

                    {/* Finish Button */}
                    {lastResultId && (
                      <Button
                        onClick={finishScreening}
                        className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        <FileText className="w-4 h-4" />
                        Lihat Hasil Lengkap
                      </Button>
                    )}
                    {analysis.dominantEmotion && analysis.dominantEmotion !== "neutral" && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Emosi dominan:</p>
                        <p className="font-medium capitalize">{analysis.dominantEmotion}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {analysis?.recommendations && analysis.recommendations.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display">Rekomendasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          rec.type === "urgent"
                            ? "bg-destructive/10 border border-destructive/20"
                            : "bg-muted/50"
                        }`}
                      >
                        <p className="font-medium text-sm mb-1">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Emergency Contact */}
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="font-medium">Butuh Bantuan Segera?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Jika Anda dalam keadaan darurat atau memiliki pikiran untuk menyakiti diri sendiri:
                  </p>
                  <div className="space-y-2 text-sm">
                    <a
                      href="tel:1198"
                      className="flex items-center gap-2 p-2 rounded-lg bg-card hover:bg-muted transition-colors"
                    >
                      <span className="font-bold text-destructive">1198</span>
                      <span className="text-muted-foreground">Hotline Kesehatan Jiwa</span>
                    </a>
                    <a
                      href="tel:112"
                      className="flex items-center gap-2 p-2 rounded-lg bg-card hover:bg-muted transition-colors"
                    >
                      <span className="font-bold text-destructive">112</span>
                      <span className="text-muted-foreground">Darurat Nasional</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20"
          >
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Ini adalah alat skrining awal berbasis AI, bukan pengganti konsultasi profesional.
              Hasil analisis bersifat indikatif. Untuk diagnosis dan penanganan yang tepat, silakan
              berkonsultasi dengan psikolog atau psikiater.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Screening;
