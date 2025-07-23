
// Mock data removido - aplicação agora consome API real
// Os dados simulados foram movidos para desenvolvimento/testes locais

import { Appointment } from '../models/appointment.model';
import { Professional } from '../models/professional.model';
import { Service } from '../models/service.model';
import { Customer } from '../models/customer.model';

// Dados vazios para evitar erros de referência
// Remover completamente quando a API estiver integrada
export const mockServices: Service[] = [];
export const mockProfessionals: Professional[] = [];
export const mockCustomers: Customer[] = [];
export const mockAppointments: Appointment[] = [];
