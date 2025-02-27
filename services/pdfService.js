// services/pdfService.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (formData) => {
  const doc = new jsPDF();
  
  // Configuración inicial
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  
  // Encabezado
  doc.text('Reporte Técnico', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`N° ${String(formData.reportNumber).padStart(4, '0')}`, 105, 22, { align: 'center' });
  doc.text(`Fecha: ${formData.date}`, 105, 28, { align: 'center' });
  
  // Información de la empresa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text([
    formData.companyInfo.name,
    formData.companyInfo.address,
    formData.companyInfo.phone,
    formData.companyInfo.email
  ], 15, 40);
  
  // Información del cliente
  doc.setFont('helvetica', 'bold');
  doc.text('Información del Cliente', 15, 65);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Empresa: ${formData.clientCompany}`,
    `Contacto: ${formData.clientContact}`,
    `Dirección: ${formData.clientAddress}`,
    `Ciudad: ${formData.clientCity}`,
    `Email: ${formData.clientEmail}`,
    `Teléfono: ${formData.clientPhone}`
  ], 15, 72);
  
  // Detalles del servicio
  doc.setFont('helvetica', 'bold');
  doc.text('Detalles del Servicio', 15, 100);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Tipo de Servicio: ${formData.serviceType}`,
    `Modelo Equipo: ${formData.equipmentModel}`,
    `Serial Equipo: ${formData.equipmentSerial}`
  ], 15, 107);
  
  // Parámetros Eléctricos
  doc.setFont('helvetica', 'bold');
  doc.text('Parámetros Eléctricos', 15, 125);
  
  // Tabla de voltajes y corrientes
  const electricalData = [
    ['Parámetro', 'L1', 'L2', 'L3', 'FF/N'],
    ['Voltaje Entrada', 
      formData.voltageInL1, 
      formData.voltageInL2, 
      formData.voltageInL3, 
      formData.voltageInFF
    ],
    ['Corriente Entrada', 
      formData.currentInL1, 
      formData.currentInL2, 
      formData.currentInL3, 
      formData.currentInN
    ],
    ['Voltaje Salida', 
      formData.voltageOutL1, 
      formData.voltageOutL2, 
      formData.voltageOutL3, 
      formData.voltageOutFF
    ],
    ['Corriente Salida', 
      formData.currentOutL1, 
      formData.currentOutL2, 
      formData.currentOutL3, 
      formData.currentOutN
    ]
  ];
  
  doc.autoTable({
    startY: 130,
    head: [electricalData[0]],
    body: electricalData.slice(1),
    theme: 'grid'
  });
  
  // Parámetros de Baterías
  const batteryData = [
    ['Parámetro', 'Valor'],
    ['Voltaje Total', formData.batteryVoltageTotal + ' V'],
    ['Corriente Descarga', formData.batteryCurrentDischarge + ' A'],
    ['Voltaje Prueba', formData.batteryVoltageTest + ' V'],
    ['Corriente Prueba', formData.batteryCurrentTest + ' A'],
    ['Cantidad Baterías', formData.batteryQuantity],
    ['Referencia', formData.batteryReference + ' Ah'],
    ['Autonomía', formData.batteryAutonomy + ' min'],
    ['Estado', formData.batteryStatus]
  ];
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [batteryData[0]],
    body: batteryData.slice(1),
    theme: 'grid'
  });
  
  // Descripción y Recomendaciones
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción del Trabajo', 15, doc.lastAutoTable.finalY + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(formData.description, 180), 15, doc.lastAutoTable.finalY + 27);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Recomendaciones', 15, doc.lastAutoTable.finalY + 50);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(formData.recommendations, 180), 15, doc.lastAutoTable.finalY + 57);
  
  // Firmas
  if (formData.clientSignature) {
    doc.addImage(formData.clientSignature, 'PNG', 15, doc.lastAutoTable.finalY + 80, 70, 30);
    doc.text('Firma del Cliente', 15, doc.lastAutoTable.finalY + 115);
    doc.text(`Nombre: ${formData.clientSignatureName}`, 15, doc.lastAutoTable.finalY + 122);
    doc.text(`ID: ${formData.clientSignatureId}`, 15, doc.lastAutoTable.finalY + 129);
  }
  
  if (formData.technicianSignature) {
    doc.addImage(formData.technicianSignature, 'PNG', 120, doc.lastAutoTable.finalY + 80, 70, 30);
    doc.text('Firma del Técnico', 120, doc.lastAutoTable.finalY + 115);
    doc.text(`Nombre: ${formData.technicianName}`, 120, doc.lastAutoTable.finalY + 122);
    doc.text(`ID: ${formData.technicianId}`, 120, doc.lastAutoTable.finalY + 129);
  }
  
  return doc;
};