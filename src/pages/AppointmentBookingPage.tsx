
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from "sonner";
import { Calendar, Clock, User, Check } from "lucide-react";

import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import ProfessionalCard from '../components/ProfessionalCard';
import serviceService from '../services/service.service';
import professionalService from '../services/professional.service';
import appointmentService from '../services/appointment.service';
import customerService from '../services/customer.service';
import appConfig from '../config/appConfig';
import { Service } from '../models/service.model';
import { Professional } from '../models/professional.model';
import { formatDate, getNextDays } from '../utils/dateUtils';
import { formatPhoneNumber, normalizePhoneNumber } from '../utils/formatUtils';
import { AppointmentFormData } from '../models/appointment.model';

const STEPS = ['service', 'professional', 'datetime', 'customer', 'confirm'];

const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: '',
    startTime: '',
    customerName: '',
    customerPhone: '',
    professionalId: '',
    serviceIds: [],
  });
  
  // State for UI selections
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Queries for services and professionals
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });
  
  const { data: professionals = [] } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => professionalService.getProfessionals(),
    enabled: currentStep >= 1
  });
  
  // Query for availability once date and professional are selected
  const { data: availability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['availability', selectedDate, formData.professionalId],
    queryFn: () => appointmentService.getAvailability(selectedDate, formData.professionalId),
    enabled: !!(selectedDate && formData.professionalId && currentStep === 2)
  });
  
  // Generate dates for date selection
  const nextDates = getNextDays(14);
  
  // Mutation for creating appointment
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      // First check if customer exists by phone
      const existingCustomer = await customerService.findCustomerByPhone(
        normalizePhoneNumber(data.customerPhone)
      );
      
      // If customer exists, use their ID
      if (existingCustomer) {
        data.customerId = existingCustomer.id;
      } else {
        // Create new customer
        const newCustomer = await customerService.createCustomer(
          data.customerName,
          data.customerPhone
        );
        
        if (newCustomer) {
          data.customerId = newCustomer.id;
        }
      }
      
      // Create appointment
      return appointmentService.createAppointment(data);
    },
    onSuccess: () => {
      toast.success('Agendamento realizado com sucesso!');
      navigate('/agenda');
    },
    onError: (error) => {
      toast.error('Erro ao criar agendamento. Tente novamente.');
      console.error('Appointment creation error:', error);
    }
  });
  
  // Handle service selection
  const handleSelectService = (service: Service) => {
    const serviceId = service.id;
    let newServiceIds: string[];
    
    if (formData.serviceIds.includes(serviceId)) {
      newServiceIds = formData.serviceIds.filter(id => id !== serviceId);
    } else {
      newServiceIds = [...formData.serviceIds, serviceId];
    }
    
    setFormData({
      ...formData,
      serviceIds: newServiceIds
    });
  };
  
  // Handle professional selection
  const handleSelectProfessional = (professional: Professional) => {
    setFormData({
      ...formData,
      professionalId: professional.id
    });
    
    // Auto advance after selecting professional
    handleNextStep();
  };
  
  // Handle date selection
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };
  
  // Handle time slot selection
  const handleSelectTimeSlot = (startTime: string) => {
    setSelectedTimeSlot(startTime);
    setFormData({
      ...formData,
      date: selectedDate,
      startTime: startTime
    });
    
    // Auto advance after selecting time
    handleNextStep();
  };
  
  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerPhone') {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAppointmentMutation.mutate(formData);
  };
  
  // Navigation between steps
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Get selected services details
  const selectedServices = services.filter(
    service => formData.serviceIds.includes(service.id)
  );
  
  // Get selected professional details
  const selectedProfessional = professionals.find(
    p => p.id === formData.professionalId
  );
  
  // Calculate total price
  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price, 
    0
  );
  
  // Render the current step
  const renderStep = () => {
    switch(STEPS[currentStep]) {
      case 'service':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecione os serviços</h2>
            {services.map(service => (
              <ServiceCard 
                key={service.id}
                service={service}
                selected={formData.serviceIds.includes(service.id)}
                selectable={true}
                onSelect={() => handleSelectService(service)}
              />
            ))}
            
            {formData.serviceIds.length > 0 && (
              <button
                className="btn-primary w-full mt-4"
                onClick={handleNextStep}
              >
                Continuar
              </button>
            )}
          </div>
        );
        
      case 'professional':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecione o profissional</h2>
            
            {appConfig.isMultiProfessional ? (
              professionals.map(professional => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  selected={formData.professionalId === professional.id}
                  onSelect={() => handleSelectProfessional(professional)}
                />
              ))
            ) : (
              // For single professional mode, auto-select the first professional
              professionals.length > 0 && (
                <ProfessionalCard
                  professional={professionals[0]}
                  selected={true}
                  onSelect={() => handleSelectProfessional(professionals[0])}
                />
              )
            )}
          </div>
        );
        
      case 'datetime':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecione a data e horário</h2>
            
            {/* Date selection */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">Data</h3>
              <div className="flex overflow-x-auto pb-2 space-x-2">
                {nextDates.map(date => (
                  <div
                    key={date}
                    className={`flex flex-col items-center min-w-[4.5rem] p-2 rounded-lg cursor-pointer ${
                      selectedDate === date 
                        ? 'bg-barber-primary text-white' 
                        : 'bg-gray-100'
                    }`}
                    onClick={() => handleSelectDate(date)}
                  >
                    <span className="text-xs">
                      {new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-medium">
                      {new Date(date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Time slot selection */}
            {selectedDate && (
              <div>
                <h3 className="text-md font-medium mb-3">Horário</h3>
                
                {isLoadingAvailability ? (
                  <div className="text-center py-4">
                    <div className="animate-pulse">Carregando horários...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availability?.slots
                      .filter(slot => slot.isAvailable)
                      .map(slot => (
                        <div
                          key={slot.startTime}
                          className={`py-2 px-3 text-center rounded-lg cursor-pointer ${
                            selectedTimeSlot === slot.startTime
                              ? 'bg-barber-primary text-white'
                              : 'bg-gray-100'
                          }`}
                          onClick={() => handleSelectTimeSlot(slot.startTime)}
                        >
                          <span className="text-sm">{slot.startTime}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'customer':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Seus dados</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Seu nome</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Seu telefone</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Observações (opcional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Alguma observação especial?"
                />
              </div>
              
              <button
                type="button"
                className="btn-primary w-full mt-6"
                onClick={handleNextStep}
                disabled={!formData.customerName || !formData.customerPhone}
              >
                Revisar e Confirmar
              </button>
            </form>
          </div>
        );
        
      case 'confirm':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Confirmar Agendamento</h2>
            
            <div className="card-shadow p-4 mb-4">
              <div className="flex items-center mb-3">
                <Calendar size={20} className="text-barber-primary mr-2" />
                <span className="font-medium">
                  {selectedDate ? formatDate(selectedDate) : ''} às {formData.startTime}
                </span>
              </div>
              
              <div className="flex items-center mb-3">
                <User size={20} className="text-barber-primary mr-2" />
                <span>{selectedProfessional?.name}</span>
              </div>
              
              <div className="border-t border-gray-200 my-3 pt-3">
                <h3 className="font-medium mb-2">Serviços selecionados:</h3>
                <ul>
                  {selectedServices.map(service => (
                    <li key={service.id} className="flex justify-between py-1">
                      <span>{service.name}</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(service.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-3 pt-3">
                <h3 className="font-medium mb-2">Seus dados:</h3>
                <p>{formData.customerName}</p>
                <p>{formData.customerPhone}</p>
                {formData.notes && <p className="text-sm mt-1">Obs: {formData.notes}</p>}
              </div>
            </div>
            
            <button
              className="btn-primary w-full flex items-center justify-center"
              onClick={handleSubmit}
              disabled={createAppointmentMutation.isPending}
            >
              {createAppointmentMutation.isPending ? (
                <span>Processando...</span>
              ) : (
                <>
                  <Check size={20} className="mr-1" />
                  <span>Confirmar Agendamento</span>
                </>
              )}
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Agendar Horário" 
        showBackButton={true}
      />
      
      <div className="flex-1 page-container pb-24">
        {/* Progress Steps */}
        <div className="flex justify-between mb-6 px-2">
          {STEPS.map((step, index) => (
            <div 
              key={step}
              className={`flex flex-col items-center ${
                index > 0 ? 'flex-1' : ''
              }`}
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index === currentStep 
                    ? 'bg-barber-primary text-white' 
                    : index < currentStep 
                      ? 'bg-barber-success text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <Check size={14} />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              
              {index < STEPS.length - 1 && (
                <div 
                  className={`h-0.5 w-full mt-3 ${
                    index < currentStep ? 'bg-barber-success' : 'bg-gray-200'
                  }`} 
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        <div>
          {renderStep()}
        </div>
        
        {/* Back Button (if not first step) */}
        {currentStep > 0 && (
          <button
            className="mt-6 py-2 px-4 text-barber-primary"
            onClick={handlePreviousStep}
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
