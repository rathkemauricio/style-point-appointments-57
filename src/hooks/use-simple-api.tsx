import { useState, useEffect } from 'react';
import { BaseService } from '../services/base.service';
import { toast } from 'sonner';

/**
 * Service class that extends BaseService to access protected methods
 */
class SimpleApiService extends BaseService {
    async getData<T>(endpoint: string, config: any = {}) {
        const response = await this.get<T>(endpoint, { requiresAuth: true, ...config });
        return response.data;
    }

    async postData<T, V>(endpoint: string, data: V, config: any = {}) {
        const response = await this.post<T>(endpoint, data, { requiresAuth: true, ...config });
        return response.data;
    }

    async putData<T, V>(endpoint: string, data: V, config: any = {}) {
        const response = await this.put<T>(endpoint, data, { requiresAuth: true, ...config });
        return response.data;
    }

    async deleteData<T>(endpoint: string, config: any = {}) {
        const response = await this.delete<T>(endpoint, { requiresAuth: true, ...config });
        return response.data;
    }
}

/**
 * Hooks simples para usar com backend pronto
 */
export const useSimpleApi = () => {
    const service = new SimpleApiService();

    // Hook para buscar dados
    const useFetch = <T,>(endpoint: string, dependencies: any[] = []) => {
        const [data, setData] = useState<T | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await service.getData<T>(endpoint);
                setData(response);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar dados');
                toast.error(err.message || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, dependencies);

        return { data, loading, error, refetch: fetchData };
    };

    // Hook para criar dados
    const useCreate = <T, V>(endpoint: string) => {
        const [loading, setLoading] = useState(false);

        const create = async (data: V): Promise<T | null> => {
            try {
                setLoading(true);
                const response = await service.postData<T, V>(endpoint, data);
                toast.success('Criado com sucesso!');
                return response;
            } catch (err: any) {
                toast.error(err.message || 'Erro ao criar');
                return null;
            } finally {
                setLoading(false);
            }
        };

        return { create, loading };
    };

    // Hook para atualizar dados
    const useUpdate = <T, V>(endpoint: string) => {
        const [loading, setLoading] = useState(false);

        const update = async (data: V): Promise<T | null> => {
            try {
                setLoading(true);
                const response = await service.putData<T, V>(endpoint, data);
                toast.success('Atualizado com sucesso!');
                return response;
            } catch (err: any) {
                toast.error(err.message || 'Erro ao atualizar');
                return null;
            } finally {
                setLoading(false);
            }
        };

        return { update, loading };
    };

    // Hook para excluir dados
    const useDelete = (endpoint: string) => {
        const [loading, setLoading] = useState(false);

        const remove = async (): Promise<boolean> => {
            try {
                setLoading(true);
                await service.deleteData(endpoint);
                toast.success('Excluído com sucesso!');
                return true;
            } catch (err: any) {
                toast.error(err.message || 'Erro ao excluir');
                return false;
            } finally {
                setLoading(false);
            }
        };

        return { remove, loading };
    };

    return {
        useFetch,
        useCreate,
        useUpdate,
        useDelete
    };
};

/**
 * Hooks específicos para entidades
 */
export const useSimpleCustomers = () => {
    const { useFetch, useCreate, useUpdate, useDelete } = useSimpleApi();

    const useCustomersList = () => useFetch('/customers/list');
    const useCustomerDetails = (id: string) => useFetch(`/customers/${id}`, [id]);
    const useCreateCustomer = () => useCreate('/customers/create');
    const useUpdateCustomer = () => useUpdate('/customers/update');
    const useDeleteCustomer = () => useDelete('/customers/delete');

    return {
        useCustomersList,
        useCustomerDetails,
        useCreateCustomer,
        useUpdateCustomer,
        useDeleteCustomer
    };
};

export const useSimpleAppointments = () => {
    const { useFetch, useCreate, useUpdate, useDelete } = useSimpleApi();

    const useAppointmentsList = () => useFetch('/appointments/list');
    const useAppointmentDetails = (id: string) => useFetch(`/appointments/${id}`, [id]);
    const useCreateAppointment = () => useCreate('/appointments/create');
    const useUpdateAppointment = () => useUpdate('/appointments/update');
    const useDeleteAppointment = () => useDelete('/appointments/delete');

    return {
        useAppointmentsList,
        useAppointmentDetails,
        useCreateAppointment,
        useUpdateAppointment,
        useDeleteAppointment
    };
};

export const useSimpleServices = () => {
    const { useFetch, useCreate, useUpdate, useDelete } = useSimpleApi();

    const useServicesList = () => useFetch('/services/list');
    const useServiceDetails = (id: string) => useFetch(`/services/${id}`, [id]);
    const useCreateService = () => useCreate('/services/create');
    const useUpdateService = () => useUpdate('/services/update');
    const useDeleteService = () => useDelete('/services/delete');

    return {
        useServicesList,
        useServiceDetails,
        useCreateService,
        useUpdateService,
        useDeleteService
    };
}; 