
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import professionalService from "@/services/professional.service";
import customerService from "@/services/customer.service";

// Schemas de validação
const barberSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  title: z.string().min(2, "Cargo/Apelido obrigatório"),
  phone: z.string().min(8, "Telefone obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});
const customerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  phone: z.string().min(8, "Telefone obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  birthdate: z.string().optional(),
});

type BarberForm = z.infer<typeof barberSchema>;
type CustomerForm = z.infer<typeof customerSchema>;

const CreateUserPage: React.FC = () => {
  const [tab, setTab] = useState<"barber" | "customer">("barber");
  const navigate = useNavigate();

  // Formulário de barbeiro
  const barberForm = useForm<BarberForm>({
    resolver: zodResolver(barberSchema),
    defaultValues: { name: "", title: "", phone: "", email: "" },
  });

  // Formulário de cliente
  const customerForm = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "", email: "", birthdate: "" },
  });

  const handleSubmitBarber = async (data: BarberForm) => {
    try {
      await professionalService.createProfessional({
        ...data,
        serviceIds: [],
        isActive: true,
      });
      toast.success("Barbeiro cadastrado com sucesso!");
      barberForm.reset();
    } catch {
      toast.error("Erro ao cadastrar barbeiro");
    }
  };

  const handleSubmitCustomer = async (data: CustomerForm) => {
    try {
      await customerService.addCustomer({
        ...data,
        createdAt: new Date().toISOString(),
        totalAppointments: 0,
      });
      toast.success("Cliente cadastrado com sucesso!");
      customerForm.reset();
    } catch {
      toast.error("Erro ao cadastrar cliente");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Cadastrar usuário" showBackButton={true} />
      <div className="flex-1 page-container flex flex-col items-center justify-center py-8">
        <div className="bg-white w-full max-w-lg rounded-lg shadow p-6">
          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "barber" ? "default" : "outline"}
              onClick={() => setTab("barber")}
            >
              Barbeiro
            </Button>
            <Button
              variant={tab === "customer" ? "default" : "outline"}
              onClick={() => setTab("customer")}
            >
              Cliente
            </Button>
          </div>
          {tab === "barber" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Cadastrar Barbeiro</h2>
              <Form {...barberForm}>
                <form
                  onSubmit={barberForm.handleSubmit(handleSubmitBarber)}
                  className="space-y-4"
                >
                  <FormField
                    control={barberForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do barbeiro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={barberForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo/Apelido</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Barbeiro, Dono, etc" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={barberForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(99) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={barberForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="nome@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={barberForm.formState.isSubmitting}>
                    {barberForm.formState.isSubmitting ? "Salvando..." : "Cadastrar"}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Cadastrar Cliente</h2>
              <Form {...customerForm}>
                <form
                  onSubmit={customerForm.handleSubmit(handleSubmitCustomer)}
                  className="space-y-4"
                >
                  <FormField
                    control={customerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(99) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="nome@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de nascimento (opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={customerForm.formState.isSubmitting}>
                    {customerForm.formState.isSubmitting ? "Salvando..." : "Cadastrar"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateUserPage;
