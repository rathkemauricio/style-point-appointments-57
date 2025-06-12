import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useServices } from '../hooks/use-services';
import { useCustomers } from '../hooks/use-customers';
import { AppointmentDTO } from '../models/dto/appointment.dto';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const appointmentSchema = z.object({
    customerId: z.string().min(1, 'Cliente é obrigatório'),
    serviceId: z.string().min(1, 'Serviço é obrigatório'),
    date: z.date({
        required_error: 'Data é obrigatória',
    }),
    time: z.string().min(1, 'Horário é obrigatório'),
    notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
    onSubmit: (data: Partial<AppointmentDTO>) => void;
    initialData?: Partial<AppointmentDTO>;
    isLoading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
    onSubmit,
    initialData,
    isLoading = false,
}) => {
    const { services } = useServices();
    const { customers } = useCustomers();

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            customerId: initialData?.customerId || '',
            serviceId: initialData?.serviceId || '',
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            time: initialData?.time || '',
            notes: initialData?.notes || '',
        },
    });

    const handleSubmit = (data: AppointmentFormValues) => {
        onSubmit({
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {customers?.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Serviço</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um serviço" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {services?.map((service) => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {service.name} - R$ {service.price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: ptBR })
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horário</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Observações adicionais" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Agendamento'}
                </Button>
            </form>
        </Form>
    );
}; 