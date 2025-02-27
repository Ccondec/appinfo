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
    <div className="grid grid-cols-3 gap-4">
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
            'Mantenimiento Preventivo',
            'Cambio Baterías',
            'Revisión Diagnóstico',
            'Mantenimiento Correctivo',
            'Instalación Arranque',
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

  const generatePDF = async () => {
    const form = formRef.current;
    if (!form) return;

    // Crear el PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 10;

    // Capturar el encabezado
    const headerElement = form.querySelector('.header');
    if (headerElement) {
      const headerCanvas = await html2canvas(headerElement);
      const headerImgData = headerCanvas.toDataURL('image/png');
      pdf.addImage(headerImgData, 'PNG', 10, yPos, pageWidth - 20, 30);
      yPos += 35;
    }

    // Información del Cliente
    pdf.setFontSize(14);
    pdf.text('Información del Cliente', 10, yPos);
    yPos += 10;
    pdf.setFontSize(10);
    Object.entries(formData)
      .filter(([key]) => key.startsWith('client'))
      .forEach(([key, value]) => {
        pdf.text(`${key.replace('client', '')}: ${value || ''}`, 15, yPos);
        yPos += 5;
      });

    // Detalles del Servicio
    yPos += 5;
    pdf.setFontSize(14);
    pdf.text('Detalles del Servicio', 10, yPos);
    yPos += 10;
    pdf.setFontSize(10);
    if (formData.serviceType) pdf.text(`Tipo de Servicio: ${formData.serviceType}`, 15, yPos);
    yPos += 5;
    if (formData.equipmentModel) pdf.text(`Modelo: ${formData.equipmentModel}`, 15, yPos);
    yPos += 5;
    if (formData.equipmentSerial) pdf.text(`Serial: ${formData.equipmentSerial}`, 15, yPos);

    // Parámetros Eléctricos
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text('Parámetros Eléctricos', 10, yPos);
    yPos += 10;
    pdf.setFontSize(10);

    // Tabla de parámetros
    const createTable = (title, data) => {
      pdf.text(title, 15, yPos);
      yPos += 5;
      const headers = ['L1', 'L2', 'L3', 'FF/N'];
      const cellWidth = 40;
      
      headers.forEach((header, i) => {
        pdf.text(header, 20 + (i * cellWidth), yPos);
      });
      yPos += 5;
      
      data.forEach((value, i) => {
        pdf.text(value || '-', 20 + (i * cellWidth), yPos);
      });
      yPos += 10;
    };

    // Voltajes y corrientes
    createTable('Voltaje de Entrada', [
      formData.voltageInL1,
      formData.voltageInL2,
      formData.voltageInL3,
      formData.voltageInFF
    ]);

    createTable('Corriente de Entrada', [
      formData.currentInL1,
      formData.currentInL2,
      formData.currentInL3,
      formData.currentInN
    ]);

    // Nueva página si es necesario
    if (yPos > 250) {
      pdf.addPage();
      yPos = 10;
    }

    // Descripción y Recomendaciones
    pdf.setFontSize(14);
    pdf.text('Descripción del Trabajo', 10, yPos);
    yPos += 10;
    pdf.setFontSize(10);
    if (formData.description) {
      const descriptionLines = pdf.splitTextToSize(formData.description, pageWidth - 30);
      pdf.text(descriptionLines, 15, yPos);
      yPos += (descriptionLines.length * 5) + 10;
    }

    // Fotografías
    if (formData.photos && formData.photos.length > 0) {
      pdf.addPage();
      yPos = 10;
      pdf.setFontSize(14);
      pdf.text('Registro Fotográfico', 10, yPos);
      yPos += 10;

      const imagesPerRow = 2;
      const imageWidth = (pageWidth - 30) / imagesPerRow;
      const imageHeight = imageWidth * 0.75;

      for (let i = 0; i < formData.photos.length; i++) {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 10;
        }

        const photo = formData.photos[i];
        const xPos = 10 + (i % imagesPerRow) * (imageWidth + 5);
        
        try {
          pdf.addImage(photo.url, 'JPEG', xPos, yPos, imageWidth, imageHeight);
          pdf.setFontSize(8);
          pdf.text(photo.description || '', xPos, yPos + imageHeight + 5);
        } catch (error) {
          console.error('Error al agregar imagen:', error);
        }

        if ((i + 1) % imagesPerRow === 0) {
          yPos += imageHeight + 20;
        }
      }
    }

    // Firmas
    pdf.addPage();
    yPos = 10;
    pdf.setFontSize(14);
    pdf.text('Firmas', 10, yPos);
    yPos += 20;

    // Agregar firmas si existen
    const addSignature = (signature, name, id, x) => {
      if (signature) {
        pdf.addImage(signature, 'PNG', x, yPos, 80, 40);
      }
      pdf.setFontSize(10);
      pdf.text(name || '', x, yPos + 45);
      pdf.text(id || '', x, yPos + 50);
    };

    if (formData.clientSignature) {
      addSignature(
        formData.clientSignature,
        formData.clientSignatureName,
        formData.clientSignatureId,
        10
      );
    }

    if (formData.technicianSignature) {
      addSignature(
        formData.technicianSignature,
        formData.technicianName,
        formData.technicianId,
        pageWidth / 2
      );
    }

    // Guardar el PDF
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
      { id: 'currentInN', label: 'N', unit: 'A' }
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
      { id: 'currentOutN', label: 'N', unit: 'A' }
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
                    { id: 'batteryCurrentDischarge', label: 'Corriente Descarga', unit: 'A' },
                    { id: 'batteryVoltageTest', label: 'Voltaje Prueba', unit: 'V' },
                    { id: 'batteryCurrentTest', label: 'Corriente Prueba', unit: 'A' }
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
                    <Label htmlFor="batteryStatus">Estado</Label>
                    <select
                      id="batteryStatus"
                      value={formData.batteryStatus || ''}
                      onChange={(e) => handleFieldChange('batteryStatus', e.target.value)}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="bueno">Bueno</option>
                      <option value="regular">Regular</option>
                      <option value="reemplazar">Reemplazar</option>
                      <option value="reemplazado">Reemplazado</option>
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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