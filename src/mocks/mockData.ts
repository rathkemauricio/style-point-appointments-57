
import { Appointment } from '../models/appointment.model';
import { Professional } from '../models/professional.model';
import { Service } from '../models/service.model';
import { Customer } from '../models/customer.model';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabelo',
    description: 'Corte moderno para todos os estilos',
    price: 40,
    duration: 30,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
    isActive: true,
    category: 'Cabelo'
  },
  {
    id: '2',
    name: 'Barba',
    description: 'Modelagem e acabamento de barba',
    price: 30,
    duration: 20,
    durationMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
    isActive: true,
    category: 'Barba'
  },
  {
    id: '3',
    name: 'Corte + Barba',
    description: 'Combo completo',
    price: 60,
    duration: 45,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
    isActive: true,
    category: 'Combo'
  },
  {
    id: '4',
    name: 'Tingimento',
    description: 'Coloração com produtos de qualidade',
    price: 80,
    duration: 60,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
    isActive: true,
    category: 'Tratamento'
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    title: 'Barbeiro Master',
    phone: '(11) 97777-8888',
    email: 'carlos@barbershop.com',
    bio: 'Especialista em cortes modernos com mais de 10 anos de experiência.',
    avatarUrl: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001',
    serviceIds: ['1', '2', '3', '4'],
    isActive: true
  },
  {
    id: '2',
    name: 'Roberto Ferreira',
    title: 'Barbeiro Sênior',
    phone: '(11) 96666-7777',
    email: 'roberto@barbershop.com',
    bio: 'Especializado em barbas e acabamentos perfeitos.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    serviceIds: ['1', '2', '3'],
    isActive: true
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Paulo',
    phone: '(11) 95555-6666',
    email: 'joao@email.com',
    birthdate: '1990-05-15',
    notes: 'Prefere corte degradê',
    createdAt: '2023-01-10T14:30:00Z',
    lastVisit: '2023-05-15T10:00:00Z',
    totalAppointments: 8
  },
  {
    id: '2',
    name: 'Miguel Santos',
    phone: '(11) 94444-5555',
    createdAt: '2023-02-20T11:45:00Z',
    lastVisit: '2023-05-10T14:00:00Z',
    totalAppointments: 3
  }
];

// Generate dates for the current week
const generateDateForDaysFromNow = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: generateDateForDaysFromNow(0),
    startTime: '14:00',
    endTime: '14:30',
    status: 'pending',
    customerId: '1',
    professionalId: '1',
    serviceIds: ['1'],
    totalPrice: 40,
    createdAt: '2023-05-20T08:30:00Z',
    customer: mockCustomers[0],
    professional: mockProfessionals[0],
    services: [mockServices[0]]
  },
  {
    id: '2',
    date: generateDateForDaysFromNow(0),
    startTime: '15:00',
    endTime: '15:45',
    status: 'confirmed',
    customerId: '2',
    professionalId: '1',
    serviceIds: ['3'],
    totalPrice: 60,
    createdAt: '2023-05-19T16:45:00Z',
    customer: mockCustomers[1],
    professional: mockProfessionals[0],
    services: [mockServices[2]]
  },
  {
    id: '3',
    date: generateDateForDaysFromNow(1),
    startTime: '10:00',
    endTime: '10:30',
    status: 'confirmed',
    customerId: '1',
    professionalId: '2',
    serviceIds: ['1'],
    totalPrice: 40,
    createdAt: '2023-05-18T09:15:00Z',
    customer: mockCustomers[0],
    professional: mockProfessionals[1],
    services: [mockServices[0]]
  },
  {
    id: '4',
    date: generateDateForDaysFromNow(2),
    startTime: '16:00',
    endTime: '17:00',
    status: 'completed',
    customerId: '2',
    professionalId: '1',
    serviceIds: ['4'],
    totalPrice: 80,
    notes: 'Cliente solicitou tingimento escuro',
    createdAt: '2023-05-15T11:20:00Z',
    customer: mockCustomers[1],
    professional: mockProfessionals[0],
    services: [mockServices[3]]
  }
];
