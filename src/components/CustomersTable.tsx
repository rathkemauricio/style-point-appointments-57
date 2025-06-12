import React from 'react';
import { CustomerDTO } from '../models/dto/customer.dto';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon, CalendarIcon } from "lucide-react";

interface CustomersTableProps {
    customers: CustomerDTO[];
    onEdit?: (customer: CustomerDTO) => void;
    onDelete?: (customer: CustomerDTO) => void;
    onSchedule?: (customer: CustomerDTO) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
    customers,
    onEdit,
    onDelete,
    onSchedule,
}) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Pontos Fidelidade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>{customer.fidelityPoints || 0}</TableCell>
                            <TableCell className="text-right space-x-2">
                                {onSchedule && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onSchedule(customer)}
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                )}
                                {onEdit && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(customer)}
                                    >
                                        <Edit2Icon className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(customer)}
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {customers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                Nenhum cliente encontrado
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}; 