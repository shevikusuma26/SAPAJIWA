import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(5000),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(100),
  conversationHistory: z.array(MessageSchema).max(50).optional(),
});

const EMOTION_LEXICON: Record<string, string> = {
  sedih: "sadness",
  kecewa: "sadness",
  "putus asa": "sadness",
  marah: "anger",
  kesal: "anger",
  frustrasi: "anger",
  takut: "fear",
  cemas: "fear",
  khawatir: "fear",
  senang: "joy",
  bahagia: "joy",
  lega: "relief",
  bingung: "confusion",
  kesepian: "loneliness",
  stres: "stress",
  depresi: "sadness",
  panik: "fear",
  gelisah: "fear",
  hopeless: "sadness",
  bunuh: "crisis",
  mati: "crisis",
  akhiri: "crisis",
};

const RISK_KEYWORDS = [
  "bunuh diri",
  "menyakiti diri",
  "tidak ingin hidup",
  "ingin mati",
  "akhiri hidup",
  "tidak ada harapan",
  "tidak berguna",
];

function analyzeText(text: string) {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Emotion analysis
  const emotionCounts: Record<string, number> = {};
  for (const word of words) {
    if (EMOTION_LEXICON[word]) {
      const emotion = EMOTION_LEXICON[word];
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }
  }
  
  // Normalize emotion scores
  const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0) || 1;
  const emotionScores = Object.fromEntries(
    Object.entries(emotionCounts).map(([k, v]) => [k, v / total])
  );
  
  // Check for crisis indicators
  const hasCrisis = RISK_KEYWORDS.some(keyword => lowerText.includes(keyword));
  
  // Sentiment score (-1 to 1)
  const positiveWords = ["baik", "senang", "bahagia", "positif", "membantu", "dukungan", "lega"];
  const negativeWords = ["buruk", "sedih", "kecewa", "negatif", "sulit", "masalah", "trauma", "stress"];
  
  let sentiment = 0;
  for (const word of words) {
    if (positiveWords.includes(word)) sentiment += 0.1;
    if (negativeWords.includes(word)) sentiment -= 0.1;
  }
  sentiment = Math.max(-1, Math.min(1, sentiment));
  
  // Determine dominant emotion
  const dominantEmotion = Object.entries(emotionScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
  
  return {
    emotionScores,
    dominantEmotion,
    sentimentScore: sentiment,
    hasCrisis,
    wordCount: words.length,
  };
}

function assessRisk(analysis: ReturnType<typeof analyzeText>) {
  let riskScore = 0;
  
  // Crisis check - highest priority
  if (analysis.hasCrisis) {
    return {
      riskLevel: "tinggi",
      confidence: 0.95,
      requiresImmediate: true,
    };
  }
  
  // Negative sentiment
  if (analysis.sentimentScore < -0.3) riskScore += 2;
  else if (analysis.sentimentScore < 0) riskScore += 1;
  
  // Negative emotions
  const negEmotions = ["sadness", "fear", "anger", "stress", "loneliness"];
  for (const emotion of negEmotions) {
    if (analysis.emotionScores[emotion] > 0.3) riskScore += 2;
    else if (analysis.emotionScores[emotion] > 0.1) riskScore += 1;
  }
  
  let riskLevel: string;
  let confidence: number;
  
  if (riskScore >= 5) {
    riskLevel = "tinggi";
    confidence = 0.85;
  } else if (riskScore >= 2) {
    riskLevel = "sedang";
    confidence = 0.75;
  } else {
    riskLevel = "rendah";
    confidence = 0.80;
  }
  
  return { riskLevel, confidence, requiresImmediate: false };
}

function getRecommendations(riskLevel: string, dominantEmotion: string) {
  const recommendations = [];
  
  if (riskLevel === "tinggi") {
    recommendations.push({
      type: "urgent",
      title: "Bantuan Segera",
      description: "Silakan hubungi hotline kesehatan mental 1198 atau kunjungi IGD terdekat.",
    });
    recommendations.push({
      type: "professional",
      title: "Konsultasi Profesional",
      description: "Kami sangat menyarankan untuk berbicara dengan psikolog atau psikiater sesegera mungkin.",
    });
  }
  
  if (riskLevel === "sedang") {
    recommendations.push({
      type: "professional",
      title: "Konsultasi Psikolog",
      description: "Pertimbangkan untuk membuat janji dengan psikolog untuk mendapatkan dukungan profesional.",
    });
    recommendations.push({
      type: "selfcare",
      title: "Teknik Relaksasi",
      description: "Cobalah teknik pernapasan dalam atau meditasi untuk menenangkan pikiran.",
    });
  }
  
  if (riskLevel === "rendah") {
    recommendations.push({
      type: "selfcare",
      title: "Jaga Kesehatan Mental",
      description: "Terus praktikkan kebiasaan sehat seperti olahraga teratur dan tidur cukup.",
    });
    recommendations.push({
      type: "social",
      title: "Dukungan Sosial",
      description: "Luangkan waktu untuk terhubung dengan keluarga dan teman-teman Anda.",
    });
  }
  
  // Emotion-specific recommendations
  if (dominantEmotion === "stress") {
    recommendations.push({
      type: "activity",
      title: "Manajemen Stres",
      description: "Identifikasi sumber stres dan buat daftar prioritas untuk mengelolanya.",
    });
  }
  
  if (dominantEmotion === "loneliness") {
    recommendations.push({
      type: "social",
      title: "Bangun Koneksi",
      description: "Bergabung dengan komunitas atau kelompok hobi untuk bertemu orang baru.",
    });
  }
  
  return recommendations;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check payload size limit (1MB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1048576) {
      return new Response(
        JSON.stringify({ error: "Permintaan terlalu besar" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Format permintaan tidak valid" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validation = RequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: "Data permintaan tidak valid" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, conversationHistory } = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Layanan tidak tersedia saat ini" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // Analyze the user's message
    const analysis = analyzeText(lastUserMessage);
    const riskAssessment = assessRisk(analysis);
    const recommendations = getRecommendations(riskAssessment.riskLevel, analysis.dominantEmotion);

    // Build conversation for AI
    const systemPrompt = `Kamu adalah SAPA-JIWA, asisten AI kesehatan mental berbahasa Indonesia yang empatik dan suportif. 
Kamu dirancang untuk:
1. Mendengarkan dengan empati dan tanpa menghakimi
2. Memberikan respons yang hangat dan mendukung
3. Membantu pengguna mengeksplorasi perasaan mereka
4. Memberikan tips kesehatan mental yang praktis
5. Mengarahkan ke bantuan profesional jika diperlukan

PENTING:
- Jangan pernah memberikan diagnosis medis
- Jika ada indikasi krisis (bunuh diri, menyakiti diri), langsung arahkan ke hotline 1198
- Gunakan bahasa yang mudah dipahami dan tidak menggurui
- Ajukan pertanyaan lanjutan untuk memahami situasi lebih baik
- Validasi perasaan pengguna

Konteks analisis emosi saat ini: ${JSON.stringify(analysis)}
Tingkat risiko: ${riskAssessment.riskLevel}`;

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Terlalu banyak permintaan, silakan coba lagi nanti." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Layanan tidak tersedia saat ini." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Terjadi kesalahan saat memproses permintaan" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return streaming response with metadata in headers
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Analysis": JSON.stringify({
          riskLevel: riskAssessment.riskLevel,
          confidence: riskAssessment.confidence,
          dominantEmotion: analysis.dominantEmotion,
          sentimentScore: analysis.sentimentScore,
          recommendations,
          requiresImmediate: riskAssessment.requiresImmediate,
        }),
      },
    });
  } catch (e) {
    console.error("Screening error:", e);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan. Silakan coba lagi." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});