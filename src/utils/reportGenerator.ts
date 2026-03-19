
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export const generateProjectReport = async () => {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: "RAPPORT DE DÉVELOPPEMENT TECHNIQUE",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: "Portfolio DevOps Full-Stack - Ahamed Hassani",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        // ... (le reste du code du rapport)
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Rapport_Technique_Portfolio.docx");
};