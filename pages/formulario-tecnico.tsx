import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, User, FileText, MapPin, Camera, X, Pen, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const currentDate = new Date().toLocaleDateString();

  const companyInfo = {
    name: "TechService S.A.",
    address: "Av. Principal #123",
    phone: "+1 234-567-8900",
    email: "contacto@techservice.com"
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
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
    <div className="max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <div className="grid grid-cols-3 items-start gap-4">
            <div className="w-32 h-16 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500 font-bold">LOGO</span>
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

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar por Correo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enviar Reporte Técnico</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailTo">Enviar a:</Label>
                      <Input
                        id="emailTo"
                        type="email"
                        placeholder="correo@empresa.com"
                        defaultValue={formData.clientEmail || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailCc">CC:</Label>
                      <Input
                        id="emailCc"
                        type="email"
                        placeholder="correo@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailMessage">Mensaje:</Label>
                      <textarea
                        id="emailMessage"
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="Mensaje adicional..."
                        defaultValue={`Adjunto encontrará el reporte técnico N° ${String(reportNumber).padStart(4, '0')} correspondiente al servicio realizado.`}
                      />
                    </div>
                    <Alert>
                      <AlertDescription>
                        Se enviará el reporte en formato PDF junto con las fotos adjuntas.
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-end">
                      <Button 
                        type="button"
                        onClick={async () => {
                          const emailTo = document.getElementById('emailTo').value;
                          const emailCc = document.getElementById('emailCc').value;
                          const emailMessage = document.getElementById('emailMessage').value;

                          try {
                            const response = await fetch('/api/send-report', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                formData: {
                                  ...formData,
                                  reportNumber,
                                  date: currentDate,
                                  companyInfo
                                },
                                emailData: {
                                  to: emailTo,
                                  cc: emailCc,
                                  message: emailMessage
                                }
                              }),
                            });

                            if (!response.ok) {
                              throw new Error('Error al enviar el reporte');
                            }

                            // Mostrar mensaje de éxito
                            alert('Reporte enviado correctamente');
                          } catch (error) {
                            console.error('Error:', error);
                            alert('Error al enviar el reporte');
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar Reporte
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalForm;