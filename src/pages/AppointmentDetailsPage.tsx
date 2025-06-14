
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Scissors, Calendar, BadgeCheck } from "lucide-react";

import appointmentService from "../services/appointment.service";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatDate, formatTime } from "../utils/dateUtils";
import { formatCurrency } from "../utils/formatUtils";
import { Button } from "../components/ui/button";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Finalizado"
};

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  cancelled: "bg-error/10 text-error",
  completed: "bg-gray-200 text-gray-700"
};

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Busca detalhes do agendamento pelo ID da URL
  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ["appointment-details", id],
    queryFn: () => appointmentService.getAppointmentById(id || ""),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Agendamento" />
        <div className="flex flex-1 items-center justify-center">
          <span>Carregando detalhes...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!appointment || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Agendamento" />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-lg text-barber-dark mb-4">Agendamento não encontrado.</p>
          <Button onClick={() => navigate("/agenda")}>
            <ArrowLeft className="mr-2" size={18} /> Voltar para Agenda
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Detalhes do Agendamento" />
      <div className="flex-1 page-container py-8">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} className="mr-2" /> Voltar
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Status */}
          <div className={`inline-block px-3 py-1 rounded-full mb-4 text-sm font-medium ${statusColors[appointment.status]}`}>
            {statusLabels[appointment.status]}
          </div>

          {/* Cliente */}
          <div className="flex items-center gap-3 mb-4">
            <User size={22} className="text-barber-primary" />
            <div>
              <div className="text-md font-semibold">
                {appointment.customer?.name || "Cliente não definido"}
              </div>
              <div className="text-gray-500 text-sm">
                {appointment.customer?.phone}
              </div>
              {appointment.customer?.email && (
                <div className="text-gray-400 text-xs">{appointment.customer.email}</div>
              )}
            </div>
          </div>

          {/* Data e Horário */}
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-barber-primary" />
            <div>
              <span className="font-medium">{formatDate(appointment.date)}</span>
              <span className="ml-2 text-gray-600">
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </span>
            </div>
          </div>

          {/* Profissional */}
          {appointment.professional && (
            <div className="flex items-center gap-3 mb-4">
              <BadgeCheck size={20} className="text-barber-primary" />
              <div>
                <span className="font-medium">{appointment.professional.name}</span>
                {appointment.professional.title && (
                  <span className="ml-2 text-gray-600 text-sm">{appointment.professional.title}</span>
                )}
              </div>
            </div>
          )}

          {/* Serviços */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Scissors size={20} className="text-barber-primary" />
              <span className="font-medium">Serviços</span>
            </div>
            <ul className="pl-7">
              {appointment.services?.map(service => (
                <li key={service.id} className="mb-1 flex items-center justify-between">
                  <span>{service.name}</span>
                  <span className="text-gray-500 text-sm">{formatCurrency(service.price)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="mb-4">
              <span className="block font-semibold mb-1">Observações:</span>
              <p className="bg-gray-100 rounded px-3 py-2 text-sm">{appointment.notes}</p>
            </div>
          )}

          {/* Valor total */}
          <div className="font-bold text-right text-lg mt-4">
            Total: {formatCurrency(appointment.totalPrice)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentDetailsPage;
