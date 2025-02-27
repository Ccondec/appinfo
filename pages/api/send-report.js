// pages/api/send-report.js
import { generatePDF } from '../../services/pdfService';
import { sendEmail } from '../../services/emailService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData, emailData } = req.body;

    // Generar el PDF
    const doc = generatePDF(formData);
    const pdfBuffer = doc.output('arraybuffer');

    // Preparar los adjuntos
    const attachments = [
      {
        filename: `Reporte_Tecnico_${String(formData.reportNumber).padStart(4, '0')}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf'
      }
    ];

    // Agregar las fotos como adjuntos
    if (formData.photos && formData.photos.length > 0) {
      formData.photos.forEach((photo, index) => {
        const base64Data = photo.url.split(';base64,').pop();
        attachments.push({
          filename: `Foto_${index + 1}.jpg`,
          content: Buffer.from(base64Data, 'base64'),
          contentType: 'image/jpeg'
        });
      });
    }

    // Enviar el correo
    await sendEmail({
      to: emailData.to,
      cc: emailData.cc,
      subject: `Reporte Técnico N° ${String(formData.reportNumber).padStart(4, '0')}`,
      message: emailData.message,
      attachments
    });

    res.status(200).json({ message: 'Reporte enviado correctamente' });
  } catch (error) {
    console.error('Error al procesar el reporte:', error);
    res.status(500).json({ message: 'Error al enviar el reporte' });
  }
}