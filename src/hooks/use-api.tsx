import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BaseService } from '../services/base.service';
import { ApiResponse, PaginatedResponse, ApiError } from '../config/api.config';

/**
 * Service class for API calls that extends BaseService
 */
class ApiService extends BaseService {
    async getData<T>(endpoint: string, config: any = {}) {
        const response = await this.get<ApiResponse<T>>(endpoint, { requiresAuth: true, ...config });
        return response.data;
    }

    async postData<T, V>(endpoint: string, data: V, config: any = {}) {
        const response = await this.post<ApiResponse<T>>(endpoint, data, { requiresAuth: true, ...config });
        return response.data;
    }

    async putData<T, V>(endpoint: string, data: V, config: any = {}) {
        const response = await this.put<ApiResponse<T>>(endpoint, data, { requiresAuth: true, ...config });
        return response.data;
    }

    async deleteData<T>(endpoint: string, config: any = {}) {
        const response = await this.delete<ApiResponse<T>>(endpoint, { requiresAuth: true, ...config });
        return response.data;
    }
}

/**
 * Custom hook for API calls with React Query
 */
export const useApi = () => {
    const queryClient = useQueryClient();
    const apiService = new ApiService();

    /**
     * Generic GET query hook
     */
    const useGet = <T,>(
        key: string[],
        endpoint: string,
        options?: UseQueryOptions<ApiResponse<T>, ApiError>
    ) => {
        return useQuery<ApiResponse<T>, ApiError>({
            queryKey: key,
            queryFn: async () => {
                return await apiService.getData<T>(endpoint);
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            ...options,
        });
    };

    /**
     * Generic POST mutation hook
     */
    const usePost = <T, V>(
        endpoint: string,
        options?: UseMutationOptions<ApiResponse<T>, ApiError, V>
    ) => {
        return useMutation<ApiResponse<T>, ApiError, V>({
            mutationFn: async (data: V) => {
                return await apiService.postData<T, V>(endpoint, data);
            },
            onSuccess: (data) => {
                if (data.message) {
                    toast.success(data.message);
                }
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                queryClient.invalidateQueries({ queryKey: ['services'] });
            },
            onError: (error) => {
                toast.error(error.message || 'Erro ao processar requisição');
            },
            ...options,
        });
    };

    /**
     * Generic PUT mutation hook
     */
    const usePut = <T, V>(
        endpoint: string,
        options?: UseMutationOptions<ApiResponse<T>, ApiError, V>
    ) => {
        return useMutation<ApiResponse<T>, ApiError, V>({
            mutationFn: async (data: V) => {
                return await apiService.putData<T, V>(endpoint, data);
            },
            onSuccess: (data) => {
                if (data.message) {
                    toast.success(data.message);
                }
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                queryClient.invalidateQueries({ queryKey: ['services'] });
            },
            onError: (error) => {
                toast.error(error.message || 'Erro ao atualizar dados');
            },
            ...options,
        });
    };

    /**
     * Generic DELETE mutation hook
     */
    const useDelete = <T,>(
        endpoint: string,
        options?: UseMutationOptions<ApiResponse<T>, ApiError, void>
    ) => {
        return useMutation<ApiResponse<T>, ApiError, void>({
            mutationFn: async () => {
                return await apiService.deleteData<T>(endpoint);
            },
            onSuccess: (data) => {
                if (data.message) {
                    toast.success(data.message);
                }
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                queryClient.invalidateQueries({ queryKey: ['services'] });
            },
            onError: (error) => {
                toast.error(error.message || 'Erro ao excluir dados');
            },
            ...options,
        });
    };

    /**
     * Paginated query hook
     */
    const usePaginatedQuery = <T,>(
        key: string[],
        endpoint: string,
        page: number = 1,
        limit: number = 10,
        options?: UseQueryOptions<PaginatedResponse<T>, ApiError>
    ) => {
        return useQuery<PaginatedResponse<T>, ApiError>({
            queryKey: [...key, page, limit],
            queryFn: async () => {
                const response = await apiService.getData<PaginatedResponse<T>>(`${endpoint}?page=${page}&limit=${limit}`);
                return response.data;
            },
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 5 * 60 * 1000, // 5 minutes
            ...options,
        });
    };

    /**
     * Optimistic update helper
     */
    const optimisticUpdate = <T,>(
        queryKey: string[],
        updater: (oldData: T | undefined) => T
    ) => {
        queryClient.setQueryData<T>(queryKey, updater);
    };

    /**
     * Prefetch data
     */
    const prefetch = async <T,>(key: string[], endpoint: string) => {
        await queryClient.prefetchQuery({
            queryKey: key,
            queryFn: async () => {
                return await apiService.getData<T>(endpoint);
            },
        });
    };

    return {
        useGet,
        usePost,
        usePut,
        useDelete,
        usePaginatedQuery,
        optimisticUpdate,
        prefetch,
        queryClient,
    };
};

/**
 * Specific API hooks for common operations
 */
export const useAppointments = () => {
    const { useGet, usePost, usePut, useDelete, usePaginatedQuery } = useApi();

    const useAppointmentsList = (page = 1, limit = 10) => {
        return usePaginatedQuery(['appointments', 'list'], '/appointments/list', page, limit);
    };

    const useAppointmentDetails = (id: string) => {
        return useGet(['appointments', 'details', id], `/appointments/${id}`);
    };

    const useCreateAppointment = () => {
        return usePost('/appointments/create');
    };

    const useUpdateAppointment = () => {
        return usePut('/appointments/update');
    };

    const useDeleteAppointment = () => {
        return useDelete('/appointments/delete');
    };

    const useAppointmentsByDate = (date: string) => {
        return useGet(['appointments', 'date', date], `/appointments/date/${date}`);
    };

    return {
        useAppointmentsList,
        useAppointmentDetails,
        useCreateAppointment,
        useUpdateAppointment,
        useDeleteAppointment,
        useAppointmentsByDate,
    };
};

export const useCustomers = () => {
    const { useGet, usePost, usePut, useDelete, usePaginatedQuery } = useApi();

    const useCustomersList = (page = 1, limit = 10) => {
        return usePaginatedQuery(['customers', 'list'], '/customers/list', page, limit);
    };

    const useCustomerDetails = (id: string) => {
        return useGet(['customers', 'details', id], `/customers/${id}`);
    };

    const useCreateCustomer = () => {
        return usePost('/customers/create');
    };

    const useUpdateCustomer = () => {
        return usePut('/customers/update');
    };

    const useDeleteCustomer = () => {
        return useDelete('/customers/delete');
    };

    const useCustomerByPhone = (phone: string) => {
        return useGet(['customers', 'phone', phone], `/customers/phone/${phone}`);
    };

    return {
        useCustomersList,
        useCustomerDetails,
        useCreateCustomer,
        useUpdateCustomer,
        useDeleteCustomer,
        useCustomerByPhone,
    };
};

export const useServices = () => {
    const { useGet, usePost, usePut, useDelete } = useApi();

    const useServicesList = () => {
        return useGet(['services', 'list'], '/services/list');
    };

    const useServiceDetails = (id: string) => {
        return useGet(['services', 'details', id], `/services/${id}`);
    };

    const useCreateService = () => {
        return usePost('/services/create');
    };

    const useUpdateService = () => {
        return usePut('/services/update');
    };

    const useDeleteService = () => {
        return useDelete('/services/delete');
    };

    return {
        useServicesList,
        useServiceDetails,
        useCreateService,
        useUpdateService,
        useDeleteService,
    };
}; 