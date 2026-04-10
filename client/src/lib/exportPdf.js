import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export a DOM element to PDF
 * @param {string} elementId - The ID of the HTML element to export
 * @param {string} filename - The name of the resulting PDF file
 */
export const exportToPdf = async (elementId, filename = "report.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("PDF Export failed", error);
  }
};
