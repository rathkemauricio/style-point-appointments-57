import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentDTO } from '../models/dto/appointment.dto';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";

interface AppointmentsTableProps {
    appointments: AppointmentDTO[];
    onEdit?: (appointment: AppointmentDTO) => void;
    onDelete?: (appointment: AppointmentDTO) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
    appointments,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.customer?.name}</TableCell>
                            <TableCell>{appointment.service?.name}</TableCell>
                            <TableCell>
                                {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(appointment.service?.price || 0)}
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${appointment.status === 'CONFIRMED'
                                    ? 'bg-green-100 text-green-800'
                                    : appointment.status === 'CANCELLED'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {appointment.status === 'CONFIRMED'
                                        ? 'Confirmado'
                                        : appointment.status === 'CANCELLED'
                                            ? 'Cancelado'
                                            : 'Pendente'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {onEdit && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(appointment)}
                                    >
                                        <Edit2Icon className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(appointment)}
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {appointments.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                Nenhum agendamento encontrado
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}; 