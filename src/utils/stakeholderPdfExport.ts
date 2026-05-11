import jsPDF from "jspdf";

interface Insight {
  id: string;
  type: "priority" | "trend" | "intervention" | "alert";
  title: string;
  description: string;
  metric?: {
    value: number;
    unit: string;
    change?: number;
  };
  priority: "high" | "medium" | "low";
  actionable: boolean;
  suggestedAction?: string;
}

interface PriorityArea {
  region: string;
  riskScore: number;
  population: number;
  needs: string[];
  urgency: "critical" | "high" | "moderate";
}

interface TrendData {
  category: string;
  currentValue: number;
  previousValue: number;
  trend: "up" | "down" | "stable";
  interpretation: string;
}

interface StakeholderReportData {
  insights: Insight[];
  priorityAreas: PriorityArea[];
  trends: TrendData[];
  lastUpdated: string;
}

export async function generateStakeholderPDF(data: StakeholderReportData): Promise<void> {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: string; color?: number[] }) => {
    doc.setFontSize(options?.fontSize || 10);
    doc.setFont("helvetica", options?.fontStyle || "normal");
    if (options?.color) {
      doc.setTextColor(options.color[0], options.color[1], options.color[2]);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    doc.text(text, x, y);
  };

  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > 280) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 40, "F");
  addText("SAPA-JIWA", margin, 18, { fontSize: 20, fontStyle: "bold", color: [255, 255, 255] });
  addText("Stakeholder Insight Dashboard Report", margin, 28, { fontSize: 12, color: [255, 255, 255] });
  addText(`Diperbarui: ${new Date(data.lastUpdated).toLocaleDateString("id-ID", { 
    day: "numeric", 
    month: "long", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, margin, 36, { fontSize: 9, color: [220, 220, 255] });

  yPosition = 55;

  // Executive Summary
  addText("RINGKASAN EKSEKUTIF", margin, yPosition, { fontSize: 14, fontStyle: "bold", color: [59, 130, 246] });
  yPosition += 10;
  
  const highPriorityCount = data.insights.filter(i => i.priority === "high").length;
  const criticalAreasCount = data.priorityAreas.filter(a => a.urgency === "critical").length;
  
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPosition - 5, contentWidth, 25, 3, 3, "F");
  addText(`• ${highPriorityCount} insight prioritas tinggi memerlukan perhatian segera`, margin + 5, yPosition + 3);
  addText(`• ${criticalAreasCount} wilayah dalam kondisi kritis`, margin + 5, yPosition + 11);
  addText(`• ${data.priorityAreas.length} wilayah prioritas teridentifikasi`, margin + 5, yPosition + 19);
  yPosition += 35;

  // High Priority Insights
  if (data.insights.filter(i => i.priority === "high").length > 0) {
    checkPageBreak(60);
    addText("INSIGHT PRIORITAS TINGGI", margin, yPosition, { fontSize: 14, fontStyle: "bold", color: [220, 38, 38] });
    yPosition += 10;

    data.insights.filter(i => i.priority === "high").forEach((insight, index) => {
      checkPageBreak(35);
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, yPosition - 5, contentWidth, 30, 3, 3, "F");
      doc.setDrawColor(220, 38, 38);
      doc.roundedRect(margin, yPosition - 5, contentWidth, 30, 3, 3, "S");
      
      addText(`${index + 1}. ${insight.title}`, margin + 5, yPosition + 2, { fontSize: 11, fontStyle: "bold" });
      
      const descLines = doc.splitTextToSize(insight.description, contentWidth - 15);
      addText(descLines[0], margin + 5, yPosition + 10, { fontSize: 9 });
      
      if (insight.suggestedAction) {
        addText(`→ ${insight.suggestedAction}`, margin + 5, yPosition + 18, { fontSize: 9, fontStyle: "italic", color: [59, 130, 246] });
      }
      
      if (insight.metric) {
        addText(`${insight.metric.value} ${insight.metric.unit}`, pageWidth - margin - 30, yPosition + 5, { fontSize: 14, fontStyle: "bold" });
      }
      
      yPosition += 38;
    });
  }

  // Priority Areas
  checkPageBreak(80);
  addText("WILAYAH PRIORITAS INTERVENSI", margin, yPosition, { fontSize: 14, fontStyle: "bold", color: [59, 130, 246] });
  yPosition += 12;

  // Table header
  doc.setFillColor(59, 130, 246);
  doc.rect(margin, yPosition - 5, contentWidth, 10, "F");
  addText("Wilayah", margin + 5, yPosition + 1, { fontSize: 9, fontStyle: "bold", color: [255, 255, 255] });
  addText("Skor Risiko", margin + 55, yPosition + 1, { fontSize: 9, fontStyle: "bold", color: [255, 255, 255] });
  addText("Populasi", margin + 90, yPosition + 1, { fontSize: 9, fontStyle: "bold", color: [255, 255, 255] });
  addText("Urgensi", margin + 125, yPosition + 1, { fontSize: 9, fontStyle: "bold", color: [255, 255, 255] });
  yPosition += 10;

  data.priorityAreas.forEach((area, index) => {
    checkPageBreak(15);
    const bgColor = index % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(margin, yPosition - 5, contentWidth, 10, "F");
    
    addText(area.region, margin + 5, yPosition + 1, { fontSize: 9 });
    addText(`${area.riskScore}%`, margin + 55, yPosition + 1, { fontSize: 9 });
    addText(area.population.toLocaleString(), margin + 90, yPosition + 1, { fontSize: 9 });
    
    const urgencyColor = area.urgency === "critical" ? [220, 38, 38] : area.urgency === "high" ? [245, 158, 11] : [34, 197, 94];
    const urgencyLabel = area.urgency === "critical" ? "Kritis" : area.urgency === "high" ? "Tinggi" : "Sedang";
    addText(urgencyLabel, margin + 125, yPosition + 1, { fontSize: 9, fontStyle: "bold", color: urgencyColor });
    
    yPosition += 10;
  });
  yPosition += 10;

  // Trends
  checkPageBreak(60);
  addText("TREN UTAMA", margin, yPosition, { fontSize: 14, fontStyle: "bold", color: [59, 130, 246] });
  yPosition += 12;

  data.trends.forEach((trend, index) => {
    checkPageBreak(25);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPosition - 5, contentWidth, 20, 3, 3, "F");
    
    const trendIcon = trend.trend === "up" ? "↑" : trend.trend === "down" ? "↓" : "→";
    const trendColor = trend.trend === "up" ? [220, 38, 38] : trend.trend === "down" ? [34, 197, 94] : [107, 114, 128];
    const changePercent = trend.previousValue > 0 
      ? Math.round(((trend.currentValue - trend.previousValue) / trend.previousValue) * 100)
      : 0;
    
    addText(trend.category, margin + 5, yPosition + 2, { fontSize: 10, fontStyle: "bold" });
    addText(`${trendIcon} ${changePercent > 0 ? "+" : ""}${changePercent}%`, pageWidth - margin - 25, yPosition + 2, { fontSize: 10, fontStyle: "bold", color: trendColor });
    addText(trend.interpretation, margin + 5, yPosition + 10, { fontSize: 8, color: [100, 100, 100] });
    
    yPosition += 25;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 285, pageWidth, 15, "F");
    addText(`Halaman ${i} dari ${totalPages}`, margin, 292, { fontSize: 8, color: [100, 100, 100] });
    addText("Laporan ini bersifat rahasia dan hanya untuk stakeholder terkait", pageWidth / 2, 292, { fontSize: 8, color: [100, 100, 100] });
    addText("SAPA-JIWA © " + new Date().getFullYear(), pageWidth - margin - 30, 292, { fontSize: 8, color: [100, 100, 100] });
  }

  // Privacy notice
  doc.setPage(totalPages);
  yPosition = 270;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, yPosition - 5, contentWidth, 15, 3, 3, "F");
  addText("⚠️ Privasi: Seluruh data bersifat agregat dan anonim. Tidak ada informasi individu dalam laporan ini.", margin + 5, yPosition + 3, { fontSize: 8 });

  // Save PDF
  const fileName = `stakeholder-insights-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
