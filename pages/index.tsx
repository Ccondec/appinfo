import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, User, FileText, MapPin, Camera, X, Pen, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Componente de firma
const SignaturePad = ({ onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches[0]) {
      return {
        offsetX: (e.touches[0].clientX - rect.left) * scaleX,
        offsetY: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  const save = () => {
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL());
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-2 bg-white">
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          className="w-full border border-gray-200 rounded touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          type="button" 
          onClick={clear}
          variant="outline"
          className="flex-1"
        >
          Borrar
        </Button>
        <Button 
          type="button" 
          onClick={save}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

// Componente para campos de entrada eléctrica
const ElectricalInputGroup = ({ title, fields, values, onChange }) => (
  <div className="space-y-4">
    <h4 className="font-medium pt-2">{title}</h4>
    <div className="grid grid-cols-4 gap-4">
      {fields.map(({ id, label, unit }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={id}>{label} ({unit})</Label>
          <Input
            id={id}
            type="number"
            value={values[id] || ''}
            onChange={(e) => onChange(id, e.target.value)}
            className="text-right"
            placeholder="0.0"
          />
        </div>
      ))}
    </div>
  </div>
);

// Componente para sección de cliente
const ClientSection = ({ values, onChange }) => (
  <div className="space-y-4">
    <h3 className="font-semibold flex items-center gap-2">
      <User className="w-5 h-5" />
      Información del Cliente
    </h3>
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {/* Columna Izquierda */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientCompany">Empresa</Label>
          <Input
            id="clientCompany"
            value={values.clientCompany || ''}
            onChange={(e) => onChange('clientCompany', e.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientAddress">Dirección</Label>
          <Input
            id="clientAddress"
            value={values.clientAddress || ''}
            onChange={(e) => onChange('clientAddress', e.target.value)}
            placeholder="Dirección de la empresa"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientCity">Ciudad</Label>
          <Input
            id="clientCity"
            value={values.clientCity || ''}
            onChange={(e) => onChange('clientCity', e.target.value)}
            placeholder="Ciudad"
          />
        </div>
      </div>
      
      {/* Columna Derecha */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientContact">Contacto</Label>
          <Input
            id="clientContact"
            value={values.clientContact || ''}
            onChange={(e) => onChange('clientContact', e.target.value)}
            placeholder="Nombre del contacto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Correo Electrónico</Label>
          <Input
            id="clientEmail"
            type="email"
            value={values.clientEmail || ''}
            onChange={(e) => onChange('clientEmail', e.target.value)}
            placeholder="correo@empresa.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientPhone">Teléfono</Label>
          <Input
            id="clientPhone"
            value={values.clientPhone || ''}
            onChange={(e) => onChange('clientPhone', e.target.value)}
            placeholder="Número de contacto"
          />
        </div>
      </div>
    </div>
  </div>
);

// Componente para sección de servicio
const ServiceSection = ({ values, onChange }) => (
  <div className="space-y-4">
    <h3 className="font-semibold flex items-center gap-2">
      <Wrench className="w-5 h-5" />
      Detalles del Servicio
    </h3>
    <div className="grid grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="serviceType">Tipo de Servicio</Label>
        <select
          id="serviceType"
          value={values.serviceType || ''}
          onChange={(e) => onChange('serviceType', e.target.value)}
          className="w-full p-2 border rounded-md bg-white"
        >
          <option value="">Seleccione un servicio</option>
          {[
            'Manto Preventivo',
            'Cambio Baterías',
            'Revis/Diagnóstico',
            'Manto Correctivo',
            'Instal/Arranque',
            'Garantía'
          ].map(service => (
            <option key={service} value={service.toLowerCase()}>{service}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="equipmentModel">Modelo Equipo</Label>
        <Input
          id="equipmentModel"
          value={values.equipmentModel || ''}
          onChange={(e) => onChange('equipmentModel', e.target.value)}
          placeholder="Modelo del equipo"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="equipmentSerial">Serial Equipo</Label>
        <Input
          id="equipmentSerial"
          value={values.equipmentSerial || ''}
          onChange={(e) => onChange('equipmentSerial', e.target.value)}
          placeholder="Número de serie"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="equipmentUbicacion">Ubicacion Equipo</Label>
        <Input
          id="equipmentUbicacion"
          value={values.equipmentUbicacion || ''}
          onChange={(e) => onChange('equipmentUbicacion', e.target.value)}
          placeholder="Ubicacion Equipo"
        />
      </div>
    </div>
  </div>
);

// Componente principal
const TechnicalForm = () => {
  const [formData, setFormData] = useState({});
  const [reportNumber, setReportNumber] = useState(1);
  const [logo, setLogo] = useState(null);
  const currentDate = new Date().toLocaleDateString();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const companyInfo = {
    name: "Ion Energy S.A.S",
    address: "CALLE 73 65-39 ",
    phone: "+57 312 4493845",
    email: "comercial@ionenergy.com.co",
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (url) => {
    setLogo(url);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

// PDF Grid Layout Implementation - Replace the current generatePDF function

const generatePDF = async () => {
  const form = formRef.current;
  if (!form) return;

  // Create PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = { top: 10, right: 10, bottom: 10, left: 10 };
  let yPos = margins.top;

  // Capture the header
  const headerElement = form.querySelector('.header');
  if (headerElement) {
    const headerCanvas = await html2canvas(headerElement);
    const headerImgData = headerCanvas.toDataURL('image/png');
    const headerHeight = 30;
    pdf.addImage(headerImgData, 'PNG', margins.left, yPos, pageWidth - (margins.left + margins.right), headerHeight);
    yPos += headerHeight + 5;
  }

  // Client Information Section
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Información del Cliente', margins.left, yPos);
  yPos += 7;
  
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  // Create a 3-column layout for client info
  const clientInfoItems = Object.entries(formData)
    .filter(([key]) => key.startsWith('client') && 
           !key.includes('Signature') && 
           key !== 'clientSignatureName' && 
           key !== 'clientSignatureId')
    .map(([key, value]) => ({
      label: key.replace('client', '').replace(/([A-Z])/g, ' $1').trim(),
      value: value || ''
    }));
  
  // Calculate column dimensions
  const clientColWidth = (pageWidth - (margins.left + margins.right)) / 3;
  
  // Determine items per column
  const itemsPerColumn = Math.ceil(clientInfoItems.length / 3);
  
  // Organize client info in three columns
  const firstColItems = clientInfoItems.slice(0, itemsPerColumn);
  const secondColItems = clientInfoItems.slice(itemsPerColumn, itemsPerColumn * 2);
  const thirdColItems = clientInfoItems.slice(itemsPerColumn * 2);
  
  const rowHeight = 5;
  let maxRowsUsed = 0;
  
  // Draw items in first column
  firstColItems.forEach((item, index) => {
    pdf.text(`${item.label}: ${item.value}`, margins.left, yPos + (index * rowHeight));
    maxRowsUsed = Math.max(maxRowsUsed, index + 1);
  });
  
  // Draw items in second column
  secondColItems.forEach((item, index) => {
    pdf.text(`${item.label}: ${item.value}`, margins.left + clientColWidth, yPos + (index * rowHeight));
    maxRowsUsed = Math.max(maxRowsUsed, index + 1);
  });
  
  // Draw items in third column
  thirdColItems.forEach((item, index) => {
    pdf.text(`${item.label}: ${item.value}`, margins.left + (clientColWidth * 2), yPos + (index * rowHeight));
    maxRowsUsed = Math.max(maxRowsUsed, index + 1);
  });
  
  yPos += (maxRowsUsed * rowHeight) + 10;

  // Service Details Section
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Detalles del Servicio', margins.left, yPos);
  yPos += 7;
  
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  // Calculate cell dimensions for 4-column layout
  const serviceColWidth = (pageWidth - (margins.left + margins.right)) / 4;
  
  // Display service information in a 4x1 grid
  const serviceParams = [
    { label: 'Servicio', value: formData.serviceType || '-' },
    { label: 'Modelo Equipo', value: formData.equipmentModel || '-' },
    { label: 'Serial Equipo', value: formData.equipmentSerial || '-' },
    { label: 'Ubicacion', value: formData.equipmentUbicacion || '-' }
  ];
  
  // Draw a background for the service details row
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margins.left, yPos, pageWidth - (margins.left + margins.right), rowHeight * 1.5, 'F');
  
  // Draw the service parameters in a 3x1 grid
  serviceParams.forEach((param, index) => {
    const xPos = margins.left + (index * serviceColWidth);
    pdf.text(`${param.label}: ${param.value}`, xPos + 3, yPos + (rowHeight * 0.8));
  });
  
  yPos += (rowHeight * 1.5) + 5;

  // Electrical Parameters Section
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Parámetros Eléctricos', margins.left, yPos);
  yPos += 7;
  
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');

  // Create tables for electrical parameters
  const createParameterTable = (title, data, startY) => {
    pdf.setFont(undefined, 'bold');
    pdf.text(title, margins.left, startY);
    pdf.setFont(undefined, 'normal');
    
    const headers = ['L1', 'L2', 'L3', 'FF/N'];
    const tableWidth = pageWidth - (margins.left + margins.right);
    const cellWidth = tableWidth / headers.length;
    const cellHeight = 7;
    
    // Draw table headers
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margins.left, startY + 2, tableWidth, cellHeight, 'F');
    
    headers.forEach((header, i) => {
      const xPos = margins.left + (i * cellWidth);
      pdf.text(header, xPos + (cellWidth / 2), startY + 7, { align: 'center' });
    });
    
    // Draw table data
    data.forEach((value, i) => {
      const xPos = margins.left + (i * cellWidth);
      pdf.text(value || '-', xPos + (cellWidth / 2), startY + 7 + cellHeight, { align: 'center' });
    });
    
    return startY + (2 * cellHeight) + 2;
  };

  // Input voltage table
  yPos = createParameterTable('Voltaje de Entrada (V)', [
    formData.voltageInL1,
    formData.voltageInL2,
    formData.voltageInL3,
    formData.voltageInFF
  ], yPos);
  
  // Input current table
  yPos = createParameterTable('Corriente de Entrada (A)', [
    formData.currentInL1,
    formData.currentInL2,
    formData.currentInL3,
    formData.currentInN
  ], yPos + 3);
  
  // Output voltage table
  yPos = createParameterTable('Voltaje de Salida (V)', [
    formData.voltageOutL1,
    formData.voltageOutL2,
    formData.voltageOutL3,
    formData.voltageOutFF
  ], yPos + 3);
  
  // Output current table
  yPos = createParameterTable('Corriente de Salida (A)', [
    formData.currentOutL1,
    formData.currentOutL2,
    formData.currentOutL3,
    formData.currentOutN
  ], yPos + 3);
  
  // Battery parameters
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Parámetros de Baterías', margins.left, yPos);
  yPos += 7;
  
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  // Create a 4x2 grid for battery parameters (12 cells total)
  const batteryParams = [
    // First row - 4 cells
    { label: 'Voltaje Total (V)', value: formData.batteryVoltageTotal || '-' },
    { label: 'Voltaje Descarga (V)', value: formData.batteryVoltageTest || '-' },
    { label: 'Corriente Descarga (A)', value: formData.batteryCurrentDischarge || '-' },
    { label: 'Corriente Carga (A)', value: formData.batteryCurrentTest || '-' },
    // Second row - 4 cells
    { label: 'Cantidad', value: formData.batteryQuantity || '-' },
    { label: 'Referencia (Ah)', value: formData.batteryReference || '-' },
    { label: 'Autonomía (min)', value: formData.batteryAutonomy || '-' },
    { label: 'Fecha Bateria', value: formData.fechaStatus || '-' },
    // Third row - 4 cells
    { label: 'Rectificador', value: formData.rectifierStatus || '-' },
    { label: 'Cargador', value: formData.chargerStatus || '-' },
    { label: 'Inversor', value: formData.inverterStatus || '-' },
    { label: 'Bateria', value: formData.batteryStatus || '-' }
  ];
  
  // Calculate cell dimensions for 4-column layout
  const batteryColWidth = (pageWidth - (margins.left + margins.right)) / 4;
  
  // Draw the battery parameters grid
  batteryParams.forEach((param, index) => {
    const row = Math.floor(index / 4); // 4 columns per row
    const col = index % 4;             // Column position (0-3)
    const xPos = margins.left + (col * batteryColWidth);
    const rowYPos = yPos + (row * rowHeight * 1.5); // Add more vertical spacing
    
    pdf.text(`${param.label}: ${param.value}`, xPos, rowYPos);
  });
  
  // Update yPos to the end of the battery grid (2 rows * row height + some padding)
  yPos += (2 * rowHeight * 1.5) + 5;

  // Description Section - Check if we need a new page
  if (yPos > pageHeight - 50) {
    pdf.addPage();
    yPos = margins.top;
  }
  
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Descripción del Trabajo', margins.left, yPos);
  yPos += 7;
  
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  if (formData.description) {
    const textWidth = pageWidth - (margins.left + margins.right) - 10; // Reduce width to account for padding
    const descriptionLines = pdf.splitTextToSize(formData.description, textWidth);
    
    // Calculate text block height with proper spacing
    const lineHeight = 5;
    const descHeight = (descriptionLines.length * lineHeight) + 10; // Add padding
    
    // Add background for description text with proper margins
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margins.left, yPos, textWidth + 10, descHeight, 'F');
    
    // Add a border
    pdf.setDrawColor(220, 220, 220);
    pdf.rect(margins.left, yPos, textWidth + 10, descHeight);
    
    // Add the text with proper padding
    pdf.text(descriptionLines, margins.left + 5, yPos + 7); // Add internal padding
    
    yPos += descHeight + 5;
  }
  
  // Recommendations
  if (formData.recommendations) {
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = margins.top;
    }
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Recomendaciones', margins.left, yPos);
    yPos += 7;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    const textWidth = pageWidth - (margins.left + margins.right) - 10; // Reduce width to account for padding
    const recommendationLines = pdf.splitTextToSize(formData.recommendations, textWidth);
    
    // Calculate text block height with proper spacing
    const lineHeight = 5;
    const recHeight = (recommendationLines.length * lineHeight) + 10; // Add padding
    
    // Add background for recommendations text with proper margins
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margins.left, yPos, textWidth + 10, recHeight, 'F');
    
    // Add a border
    pdf.setDrawColor(220, 220, 220);
    pdf.rect(margins.left, yPos, textWidth + 10, recHeight);
    
    // Add the text with proper padding
    pdf.text(recommendationLines, margins.left + 5, yPos + 7); // Add internal padding
    
    yPos += recHeight + 10;
  }

  // Photos Section - On same page as previous content if there's room
  if (formData.photos && formData.photos.length > 0) {
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = margins.top;
    }
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Registro Fotográfico', margins.left, yPos);
    yPos += 10;
    
    // Calculate grid layout for photos
    const photosPerRow = 2;
    const photoPadding = 5;
    const availableWidth = pageWidth - (margins.left + margins.right);
    const photoWidth = (availableWidth - ((photosPerRow - 1) * photoPadding)) / photosPerRow;
    const photoHeight = photoWidth * 0.75; // 4:3 aspect ratio
    const descriptionHeight = 8; // Reduced to a single line height
    const photoBlockHeight = photoHeight + descriptionHeight + 5;
    
    let currentPhotoRow = 0;
    let currentPhotoCol = 0;
    
    formData.photos.forEach((photo, index) => {
      // Calculate position in the grid
      currentPhotoCol = index % photosPerRow;
      if (currentPhotoCol === 0 && index > 0) {
        currentPhotoRow++;
      }
      
      // Calculate coordinates
      const xPos = margins.left + (currentPhotoCol * (photoWidth + photoPadding));
      const photoYPos = yPos + (currentPhotoRow * photoBlockHeight);
      
      // Check if we need a new page
      if (photoYPos + photoBlockHeight > pageHeight - margins.bottom) {
        pdf.addPage();
        yPos = margins.top;
        currentPhotoRow = 0;
      }
      
      const actualYPos = yPos + (currentPhotoRow * photoBlockHeight);
      
      // Add the photo
      try {
        pdf.addImage(photo.url, 'JPEG', xPos, actualYPos, photoWidth, photoHeight);
        
        // Add photo border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(xPos, actualYPos, photoWidth, photoHeight);
        
        // Add description background
        pdf.setFillColor(245, 245, 245);
        pdf.rect(xPos, actualYPos + photoHeight, photoWidth, descriptionHeight, 'F');
        
        // Add description text - limited to one line and centered
        pdf.setFontSize(8);
        const descText = photo.description || `Foto ${index + 1}`;
        // Truncate description if too long for a single line
        const maxChars = Math.floor(photoWidth / 1.8); // Approximate character width
        const truncatedText = descText.length > maxChars ? 
          descText.substring(0, maxChars - 3) + '...' : descText;
        // Center text horizontally under the image
        pdf.text(truncatedText, xPos + (photoWidth / 2), actualYPos + photoHeight + 5, { align: 'center' });
      } catch (error) {
        console.error('Error adding image:', error);
        
        // Display error placeholder
        pdf.setFillColor(240, 240, 240);
        pdf.rect(xPos, actualYPos, photoWidth, photoHeight, 'F');
        pdf.setFontSize(10);
        pdf.text('Error al cargar imagen', xPos + (photoWidth/2), actualYPos + (photoHeight/2), { align: 'center' });
      }
    });
    
    // Update yPos after all photos
    const totalRows = Math.ceil(formData.photos.length / photosPerRow);
    yPos += (totalRows * photoBlockHeight) + 10;
  }

  // Signatures Section - After photos on same page if room, otherwise new page
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    yPos = margins.top;
  } else {
    // Add some spacing if on same page
    yPos += 10;
  }
  
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Firmas de Conformidad', margins.left, yPos);
  yPos += 10;
  
  // Add signatures if they exist
  const signatureWidth = (pageWidth - (margins.left + margins.right) - 10) / 2;
  const signatureHeight = signatureWidth / 2;
  
  // Client signature block
  
  if (formData.clientSignature) {
    pdf.addImage(formData.clientSignature, 'PNG', margins.left, yPos, signatureWidth, signatureHeight);
  } else {
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margins.left, yPos, signatureWidth, signatureHeight);
  }
  pdf.setFontSize(12);
  pdf.text('Cliente', margins.left + (signatureWidth / 2), yPos, { align: 'center' });
  yPos += 5;

  // Technician signature block
  const techSigX = margins.left + signatureWidth + 10;

  if (formData.technicianSignature) {
    pdf.addImage(formData.technicianSignature, 'PNG', techSigX, yPos, signatureWidth, signatureHeight);
  } else {
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(techSigX, yPos, signatureWidth, signatureHeight);
  }
  
  pdf.setFontSize(12);
  pdf.text('Técnico', techSigX + (signatureWidth / 2), yPos - 5, { align: 'center' });
  yPos += signatureHeight + 5;
  
  // Client name and ID
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(formData.clientSignatureName || 'Nombre del Cliente', margins.left + (signatureWidth / 2), yPos, { align: 'center' });
  yPos += 5;
  pdf.text(formData.clientSignatureId || 'Identificación', margins.left + (signatureWidth / 2), yPos, { align: 'center' });
  
  // Technician name and ID
  pdf.text(formData.technicianName || 'Nombre del Técnico', techSigX + (signatureWidth / 2), yPos - 5, { align: 'center' });
  pdf.text(formData.technicianId || 'Identificación', techSigX + (signatureWidth / 2), yPos, { align: 'center' });
  
  // Add footer to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    
    // Add page numbers
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    // Add report number and date
    pdf.text(`Reporte N° ${String(reportNumber).padStart(4, '0')} | Fecha: ${currentDate}`, margins.left, pageHeight - 5);
    
    // Add company name
    pdf.text(companyInfo.name, pageWidth - margins.right, pageHeight - 5, { align: 'right' });
  }

  // Save the PDF
  pdf.save(`reporte-tecnico-${String(reportNumber).padStart(4, '0')}.pdf`);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    await generatePDF();
    setReportNumber(prev => prev + 1);
  };

  const electricalParameters = {
    inputVoltage: [
      { id: 'voltageInL1', label: 'L1', unit: 'V' },
      { id: 'voltageInL2', label: 'L2', unit: 'V' },
      { id: 'voltageInL3', label: 'L3', unit: 'V' },
      { id: 'voltageInFF', label: 'FF', unit: 'V' }
    ],
    inputCurrent: [
      { id: 'currentInL1', label: 'L1', unit: 'A' },
      { id: 'currentInL2', label: 'L2', unit: 'A' },
      { id: 'currentInL3', label: 'L3', unit: 'A' },
      { id: 'currentInN', label: 'Neutro-Tierra', unit: 'V' }
    ],
    outputVoltage: [
      { id: 'voltageOutL1', label: 'L1', unit: 'V' },
      { id: 'voltageOutL2', label: 'L2', unit: 'V' },
      { id: 'voltageOutL3', label: 'L3', unit: 'V' },
      { id: 'voltageOutFF', label: 'FF', unit: 'V' }
    ],
    outputCurrent: [
      { id: 'currentOutL1', label: 'L1', unit: 'A' },
      { id: 'currentOutL2', label: 'L2', unit: 'A' },
      { id: 'currentOutL3', label: 'L3', unit: 'A' },
      { id: 'currentOutN', label: 'Neutro-Tierra', unit: 'V' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-4" ref={formRef}>
      <Card className="w-full">
        <CardHeader className="space-y-2 header">
          <div className="grid grid-cols-3 items-start gap-4">
            {/* Logo section */}
            <div className="relative">
              {logo ? (
                <div className="w-32 h-16 relative group">
                  <img 
                    src={logo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white p-1"
                      onClick={() => setLogo(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-16 bg-gray-200 flex flex-col items-center justify-center rounded cursor-pointer hover:bg-gray-300"
                     onClick={() => fileInputRef.current?.click()}>
                  <span className="text-gray-500 font-bold text-sm">LOGO</span>
                  <span className="text-gray-500 text-xs">Click para cambiar</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
            
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">Reporte Técnico</h1>
              <div className="space-y-1">
                <div className="text-lg font-medium">N° Reporte: {String(reportNumber).padStart(4, '0')}</div>
                <div className="text-sm text-gray-600">Fecha: {currentDate}</div>
              </div>
            </div>

            <div className="text-right">
              <h2 className="font-bold text-xl">{companyInfo.name}</h2>
              <p className="text-sm text-gray-600">{companyInfo.address}</p>
              <p className="text-sm text-gray-600">{companyInfo.phone}</p>
              <p className="text-sm text-gray-600">{companyInfo.email}</p>
            </div>
          </div>
          
          <div className="border-t border-b py-2 mt-4" />
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ClientSection values={formData} onChange={handleFieldChange} />
            <ServiceSection values={formData} onChange={handleFieldChange} />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Descripción Técnica
              </h3>

              {/* Parámetros Eléctricos */}
              <ElectricalInputGroup
                title="Voltaje de Entrada"
                fields={electricalParameters.inputVoltage}
                values={formData}
                onChange={handleFieldChange}
              />
              <ElectricalInputGroup
                title="Corriente de Entrada"
                fields={electricalParameters.inputCurrent}
                values={formData}
                onChange={handleFieldChange}
              />
              <ElectricalInputGroup
                title="Voltaje de Salida"
                fields={electricalParameters.outputVoltage}
                values={formData}
                onChange={handleFieldChange}
              />
              <ElectricalInputGroup
                title="Corriente de Salida"
                fields={electricalParameters.outputCurrent}
                values={formData}
                onChange={handleFieldChange}
              />

              {/* Parámetros de Baterías */}
              <div className="space-y-4">
                <h4 className="font-medium pt-4">Parámetros de Baterías</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { id: 'batteryVoltageTotal', label: 'Voltaje Total', unit: 'V' },
                    { id: 'batteryVoltageTest', label: 'Voltaje Descarga', unit: 'V' },
                    { id: 'batteryCurrentDischarge', label: 'Corriente Descarga', unit: 'A' },
                    { id: 'batteryCurrentTest', label: 'Corriente Carga', unit: 'A' }
                  ].map(({ id, label, unit }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label} ({unit})</Label>
                      <Input
                        id={id}
                        type="number"
                        value={formData[id] || ''}
                        onChange={(e) => handleFieldChange(id, e.target.value)}
                        className="text-right"
                        placeholder="0.0"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="batteryQuantity">Cantidad Baterías</Label>
                    <Input
                      id="batteryQuantity"
                      type="number"
                      value={formData.batteryQuantity || ''}
                      onChange={(e) => handleFieldChange('batteryQuantity', e.target.value)}
                      className="text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batteryReference">Referencia (Ah)</Label>
                    <Input
                      id="batteryReference"
                      value={formData.batteryReference || ''}
                      onChange={(e) => handleFieldChange('batteryReference', e.target.value)}
                      className="text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batteryAutonomy">Autonomía (min)</Label>
                    <Input
                      id="batteryAutonomy"
                      type="number"
                      value={formData.batteryAutonomy || ''}
                      onChange={(e) => handleFieldChange('batteryAutonomy', e.target.value)}
                      className="text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batteryFecha">Fecha Fabricacion (FI)</Label>
                    <Input
                      id="batteryFecha"
                      value={formData.batteryFecha || ''}
                      onChange={(e) => handleFieldChange('batteryFecha', e.target.value)}
                      className="text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rectifierStatus">Rectificador/Cargador</Label>
                    <select
                      id="rectifierStatus"
                      value={formData.rectifierStatus || ''}
                      onChange={(e) => handleFieldChange('rectifierStatus', e.target.value)}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="bueno">Bueno</option>
                      <option value="revisar">Revisar</option>
                      <option value="falla">Falla</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chargerStatus">Estado Cargador</Label>
                    <select
                      id="chargerStatus"
                      value={formData.chargerStatus || ''}
                      onChange={(e) => handleFieldChange('chargerStatus', e.target.value)}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="bueno">Bueno</option>
                      <option value="revisar">Revisar</option>
                      <option value="falla">Falla</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inverterStatus">Estado Inversor</Label>
                    <select
                      id="inverterStatus"
                      value={formData.inverterStatus || ''}
                      onChange={(e) => handleFieldChange('inverterStatus', e.target.value)}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="bueno">Bueno</option>
                      <option value="revisar">Revisar</option>
                      <option value="falla">Falla</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batteryStatus">Estado bateria</Label>
                    <select
                      id="batteryStatus"
                      value={formData.batteryStatus || ''}
                      onChange={(e) => handleFieldChange('batteryStatus', e.target.value)}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="bueno">Bueno</option>
                      <option value="regular">Regular</option>
                      <option value="remplazar">Remplazar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Descripción del trabajo */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Descripción del trabajo realizado</Label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Detalle el trabajo realizado..."
                />
              </div>

              {/* Recomendaciones */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="recommendations">Recomendaciones</Label>
                <textarea
                  id="recommendations"
                  value={formData.recommendations || ''}
                  onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Ingrese las recomendaciones..."
                />
              </div>
            </div>

            {/* Sección de Fotos */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Registro Fotográfico
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    type="button"
                    onClick={() => document.getElementById('photoInput').click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Tomar Foto
                  </Button>
                  <input
                    type="file"
                    id="photoInput"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setFormData(prev => ({
                              ...prev,
                              photos: [...(prev.photos || []), {
                                id: Date.now(),
                                url: event.target.result,
                                description: ''
                              }]
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }}
                  />
                </div>

                {/* Grid de Fotos */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {(formData.photos || []).map((photo, index) => (
                    <div key={photo.id} className="space-y-2">
                      <div className="relative">
                        <img
                          src={photo.url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              photos: prev.photos.filter(p => p.id !== photo.id)
                            }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        placeholder="Descripción de la foto..."
                        className="w-full p-2 text-sm border rounded-md"
                        value={photo.description}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            photos: prev.photos.map(p =>
                              p.id === photo.id
                                ? { ...p, description: e.target.value }
                                : p
                            )
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección de Firmas */}
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Pen className="w-5 h-5" />
                Firmas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Firma del Cliente */}
                <div className="space-y-4">
                  <h4 className="font-medium text-center">Firma del Cliente</h4>
                  <SignaturePad
                    onSave={(dataUrl) => {
                      setFormData(prev => ({
                        ...prev,
                        clientSignature: dataUrl
                      }));
                    }}
                    onClear={() => {
                      setFormData(prev => ({
                        ...prev,
                        clientSignature: null
                      }));
                    }}
                  />
                  <div className="space-y-2">
                    <Input
                      id="clientSignatureName"
                      value={formData.clientSignatureName || ''}
                      onChange={(e) => handleFieldChange('clientSignatureName', e.target.value)}
                      placeholder="Nombre del Cliente"
                      className="text-center text-sm"
                    />
                    <Input
                      id="clientSignatureId"
                      value={formData.clientSignatureId || ''}
                      onChange={(e) => handleFieldChange('clientSignatureId', e.target.value)}
                      placeholder="Número de Identificación"
                      className="text-center text-sm"
                    />
                  </div>
                </div>

                {/* Firma del Técnico */}
                <div className="space-y-4">
                  <h4 className="font-medium text-center">Firma del Técnico</h4>
                  <SignaturePad
                    onSave={(dataUrl) => {
                      setFormData(prev => ({
                        ...prev,
                        technicianSignature: dataUrl
                      }));
                    }}
                    onClear={() => {
                      setFormData(prev => ({
                        ...prev,
                        technicianSignature: null
                      }));
                    }}
                  />
                  <div className="space-y-2">
                    <Input
                      id="technicianName"
                      value={formData.technicianName || ''}
                      onChange={(e) => handleFieldChange('technicianName', e.target.value)}
                      placeholder="Nombre del Técnico"
                      className="text-center text-sm"
                    />
                    <Input
                      id="technicianId"
                      value={formData.technicianId || ''}
                      onChange={(e) => handleFieldChange('technicianId', e.target.value)}
                      placeholder="Número de Identificación"
                      className="text-center text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Generar Reporte
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalForm;