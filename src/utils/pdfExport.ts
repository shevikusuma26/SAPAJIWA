import jsPDF from "jspdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ScreeningResultData {
  id: string;
  risk_level: string;
  confidence: number | null;
  sentiment_score: number | null;
  dominant_emotion: string | null;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
  }> | null;
  created_at: string;
  screening_type: string;
  phq9_score?: number | null;
  gad7_score?: number | null;
}

const getEmotionLabel = (emotion: string): string => {
  const labels: Record<string, string> = {
    happiness: "Kebahagiaan",
    sadness: "Kesedihan",
    anxiety: "Kecemasan",
    anger: "Kemarahan",
    fear: "Ketakutan",
    neutral: "Netral",
    hopeful: "Penuh Harapan",
    stressed: "Stres",
  };
  return labels[emotion] || emotion;
};

const getRiskLabel = (level: string): string => {
  switch (level) {
    case "tinggi": return "Risiko Tinggi";
    case "sedang": return "Risiko Sedang";
    default: return "Risiko Rendah";
  }
};

export async function generateScreeningPDF(result: ScreeningResultData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: string; color?: number[] }) => {
    if (options?.fontSize) doc.setFontSize(options.fontSize);
    if (options?.fontStyle) doc.setFont("helvetica", options.fontStyle);
    if (options?.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
    else doc.setTextColor(0, 0, 0);
    doc.text(text, x, y);
    return y;
  };

  const addLine = (y: number, color?: number[]) => {
    if (color) doc.setDrawColor(color[0], color[1], color[2]);
    else doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    return y + 5;
  };

  // Header
  addText("SAPA-JIWA", margin, yPos, { fontSize: 24, fontStyle: "bold", color: [41, 98, 255] });
  yPos += 8;
  addText("Laporan Hasil Skrining Kesehatan Mental", margin, yPos, { fontSize: 12, fontStyle: "normal", color: [100, 100, 100] });
  yPos += 15;
  yPos = addLine(yPos);
  yPos += 5;

  // Date and ID
  addText(`Tanggal: ${format(new Date(result.created_at), "dd MMMM yyyy, HH:mm", { locale: id })}`, margin, yPos, { fontSize: 10, color: [80, 80, 80] });
  yPos += 6;
  addText(`ID Skrining: ${result.id}`, margin, yPos, { fontSize: 10, color: [80, 80, 80] });
  yPos += 6;
  addText(`Tipe: ${result.screening_type === "chat" ? "Chat AI" : result.screening_type === "phq9" ? "PHQ-9" : result.screening_type === "gad7" ? "GAD-7" : result.screening_type}`, margin, yPos, { fontSize: 10, color: [80, 80, 80] });
  yPos += 15;

  // Risk Level Box
  const riskColors: Record<string, number[]> = {
    tinggi: [220, 38, 38],
    sedang: [245, 158, 11],
    rendah: [34, 197, 94],
  };
  const riskColor = riskColors[result.risk_level] || riskColors.rendah;
  
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 30, 3, 3, "F");
  
  addText(getRiskLabel(result.risk_level), margin + 10, yPos + 12, { fontSize: 16, fontStyle: "bold", color: [255, 255, 255] });
  
  if (result.confidence) {
    addText(`Kepercayaan: ${Math.round(result.confidence * 100)}%`, margin + 10, yPos + 22, { fontSize: 10, color: [255, 255, 255] });
  }
  
  yPos += 40;

  // Analysis Section
  addText("Analisis", margin, yPos, { fontSize: 14, fontStyle: "bold" });
  yPos += 10;

  // Sentiment Score
  if (result.sentiment_score !== null) {
    const sentimentPercent = Math.round((result.sentiment_score + 1) * 50);
    addText(`Skor Sentimen: ${sentimentPercent}%`, margin, yPos, { fontSize: 11 });
    yPos += 5;
    
    // Progress bar for sentiment
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin, yPos, 100, 6, 2, 2, "F");
    doc.setFillColor(41, 98, 255);
    doc.roundedRect(margin, yPos, sentimentPercent, 6, 2, 2, "F");
    yPos += 12;
  }

  // Dominant Emotion
  if (result.dominant_emotion) {
    addText(`Emosi Dominan: ${getEmotionLabel(result.dominant_emotion)}`, margin, yPos, { fontSize: 11 });
    yPos += 12;
  }

  // PHQ-9 Score
  if (result.phq9_score !== null && result.phq9_score !== undefined) {
    addText(`Skor PHQ-9 (Depresi): ${result.phq9_score}/27`, margin, yPos, { fontSize: 11 });
    yPos += 8;
  }

  // GAD-7 Score
  if (result.gad7_score !== null && result.gad7_score !== undefined) {
    addText(`Skor GAD-7 (Kecemasan): ${result.gad7_score}/21`, margin, yPos, { fontSize: 11 });
    yPos += 8;
  }

  yPos += 10;
  yPos = addLine(yPos);
  yPos += 5;

  // Recommendations
  if (result.recommendations && result.recommendations.length > 0) {
    addText("Rekomendasi", margin, yPos, { fontSize: 14, fontStyle: "bold" });
    yPos += 10;

    result.recommendations.forEach((rec, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      const isUrgent = rec.type === "urgent";
      if (isUrgent) {
        doc.setFillColor(254, 226, 226);
      } else {
        doc.setFillColor(243, 244, 246);
      }
      
      doc.roundedRect(margin, yPos - 4, pageWidth - margin * 2, 20, 2, 2, "F");
      
      addText(`${index + 1}. ${rec.title}`, margin + 5, yPos + 4, { fontSize: 11, fontStyle: "bold", color: isUrgent ? [220, 38, 38] : [0, 0, 0] });
      
      const descLines = doc.splitTextToSize(rec.description, pageWidth - margin * 2 - 15);
      addText(descLines[0], margin + 5, yPos + 12, { fontSize: 9, fontStyle: "normal", color: [80, 80, 80] });
      
      yPos += 25;
    });
  }

  yPos += 10;

  // Emergency Contact for High Risk
  if (result.risk_level === "tinggi") {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 35, 3, 3, "F");
    
    addText("KONTAK DARURAT", margin + 10, yPos + 10, { fontSize: 12, fontStyle: "bold", color: [220, 38, 38] });
    addText("1198 - Hotline Kesehatan Jiwa", margin + 10, yPos + 20, { fontSize: 10, color: [100, 100, 100] });
    addText("112 - Darurat Nasional", margin + 10, yPos + 28, { fontSize: 10, color: [100, 100, 100] });
    
    yPos += 45;
  }

  // Disclaimer
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(254, 249, 195);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 2, 2, "F");
  
  addText("PENTING", margin + 5, yPos + 8, { fontSize: 9, fontStyle: "bold", color: [180, 120, 0] });
  const disclaimerText = "Hasil ini merupakan skrining awal berbasis AI dan bukan diagnosis medis. Untuk penanganan yang tepat, silakan berkonsultasi dengan psikolog atau psikiater.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - margin * 2 - 10);
  addText(disclaimerLines.join(" "), margin + 5, yPos + 16, { fontSize: 8, fontStyle: "normal", color: [100, 80, 0] });

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 15;
  addText(`Dibuat oleh SAPA-JIWA | ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, margin, yPos, { fontSize: 8, color: [150, 150, 150] });
  addText("www.sapa-jiwa.com", pageWidth - margin - 30, yPos, { fontSize: 8, color: [150, 150, 150] });

  // Save the PDF
  const fileName = `SAPA-JIWA_Hasil_Skrining_${format(new Date(result.created_at), "yyyy-MM-dd_HHmm")}.pdf`;
  doc.save(fileName);
}
