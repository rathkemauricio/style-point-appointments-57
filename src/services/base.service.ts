import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig } from '../config/api.config';
import { toast } from 'sonner';

// Extend AxiosRequestConfig to include requiresAuth
declare module 'axios' {
    export interface AxiosRequestConfig {
        requiresAuth?: boolean;
    }
}

/**
 * Base service class with common functionality
 */
export class BaseService {
    protected api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: apiConfig.baseUrl,
            timeout: apiConfig.timeout,
            headers: apiConfig.headers
        });

        // Add request interceptor for auth token
        this.api.interceptors.request.use(
            (config) => {
                // Only add token if requiresAuth is true
                if (config.requiresAuth) {
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            // Unauthorized - clear auth data and redirect to login
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('auth_user');
                            window.location.href = '/login';
                            toast.error('Sessão expirada. Por favor, faça login novamente.');
                            break;
                        case 403:
                            toast.error('Acesso não autorizado.');
                            break;
                        case 404:
                            toast.error('Recurso não encontrado.');
                            break;
                        case 422:
                            // Validation errors
                            const errors = error.response.data.errors;
                            if (errors && typeof errors === 'object') {
                                Object.values(errors).forEach((err: any) => {
                                    toast.error(err[0]);
                                });
                            } else {
                                toast.error('Erro de validação.');
                            }
                            break;
                        case 500:
                            toast.error('Erro no servidor. Tente novamente mais tarde.');
                            break;
                        default:
                            toast.error('Ocorreu um erro. Tente novamente.');
                    }
                } else if (error.request) {
                    // Network error
                    toast.error('Erro de conexão. Verifique sua internet.');
                } else {
                    toast.error('Ocorreu um erro. Tente novamente.');
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Handle API response
     */
    protected handleResponse<T>(response: AxiosResponse): T | null {
        return response.data || null;
    }

    /**
     * Handle API error
     */
    protected handleError(error: any): null {
        console.error('API Error:', error);
        return null;
    }

    /**
     * Get current user ID from local storage
     */
    protected getCurrentUserId(): string | null {
        const userJson = localStorage.getItem('auth_user');
        if (!userJson) return null;

        try {
            const user = JSON.parse(userJson);
            return user.id;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    protected isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    /**
     * Generic GET request
     */
    protected async get<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return this.api.get<T>(endpoint, config);
    }

    /**
     * Generic POST request
     */
    protected async post<T>(endpoint: string, data: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return this.api.post<T>(endpoint, data, config);
    }

    /**
     * Generic PUT request
     */
    protected async put<T>(endpoint: string, data: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return this.api.put<T>(endpoint, data, config);
    }

    /**
     * Generic DELETE request
     */
    protected async delete<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return this.api.delete<T>(endpoint, config);
    }
} 