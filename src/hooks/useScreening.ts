import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ScreeningAnalysis {
  riskLevel: string;
  confidence: number;
  dominantEmotion: string;
  sentimentScore: number;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  requiresImmediate: boolean;
}

export function useScreening() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Selamat datang di SAPA-JIWA. Saya di sini untuk mendengarkan Anda dengan empati dan tanpa menghakimi. Silakan ceritakan bagaimana perasaan Anda hari ini atau apa yang sedang Anda alami.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ScreeningAnalysis | null>(null);
  const [lastResultId, setLastResultId] = useState<string | null>(null);
  const { user } = useAuth();

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();

      try {
        // Build conversation history for context
        const conversationHistory = messages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-screening`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: text.trim() }],
              conversationHistory,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
          }
          if (response.status === 402) {
            throw new Error("Layanan tidak tersedia saat ini.");
          }
          throw new Error("Gagal menghubungi server");
        }

        // Parse analysis from headers
        const analysisHeader = response.headers.get("X-Analysis");
        if (analysisHeader) {
          const parsedAnalysis = JSON.parse(analysisHeader);
          setAnalysis(parsedAnalysis);
        }

        // Stream the response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response body");

        let textBuffer = "";

        // Add initial assistant message
        setMessages((prev) => [
          ...prev,
          { id: assistantId, text: "", sender: "bot", timestamp: new Date() },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          // Process SSE events
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, text: assistantContent } : m
                  )
                );
              }
            } catch {
              // Incomplete JSON, put back and wait for more data
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Save to database automatically when we have analysis
        const analysisFromHeader = response.headers.get("X-Analysis");
        if (analysisFromHeader) {
          const parsedAnalysisData = JSON.parse(analysisFromHeader);
          
          // Generate session token for anonymous users
          const sessionToken = !user ? crypto.randomUUID() : null;
          
          const { data: insertedResult, error: insertError } = await supabase
            .from("screening_results")
            .insert({
              user_id: user?.id || null,
              screening_type: "chat",
              responses: [...messages, userMessage].map((m) => ({
                role: m.sender,
                content: m.text,
              })),
              risk_level: parsedAnalysisData.riskLevel,
              confidence: parsedAnalysisData.confidence,
              sentiment_score: parsedAnalysisData.sentimentScore,
              dominant_emotion: parsedAnalysisData.dominantEmotion,
              recommendations: parsedAnalysisData.recommendations,
              is_anonymous: !user,
              session_token: sessionToken,
            })
            .select("id")
            .single();

          if (!insertError && insertedResult) {
            setLastResultId(insertedResult.id);
            // Store session token in localStorage for anonymous access
            if (sessionToken) {
              localStorage.setItem(`screening_token_${insertedResult.id}`, sessionToken);
            }
          }
        }
      } catch (error) {
        console.error("Screening error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            text:
              error instanceof Error
                ? error.message
                : "Maaf, terjadi kesalahan. Silakan coba lagi.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, user]
  );

  const finishScreening = useCallback(() => {
    if (lastResultId) {
      navigate(`/screening/result/${lastResultId}`);
    }
  }, [lastResultId, navigate]);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: "1",
        text: "Selamat datang di SAPA-JIWA. Saya di sini untuk mendengarkan Anda dengan empati dan tanpa menghakimi. Silakan ceritakan bagaimana perasaan Anda hari ini atau apa yang sedang Anda alami.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setAnalysis(null);
  }, []);

  return {
    messages,
    isLoading,
    analysis,
    lastResultId,
    sendMessage,
    clearConversation,
    finishScreening,
  };
}
