
import { toast } from "sonner";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * API service for handling network requests with standardized error handling
 */
class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Makes an API request with error handling
   */
  async request<T = any>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const headers = { ...this.defaultHeaders, ...options.headers };
    
    const config: RequestInit = {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.status === 404) {
        toast.error('Recurso não encontrado');
        return { data: null, error: 'Recurso não encontrado', status: 404 };
      }
      
      if (response.status === 500) {
        toast.error('Erro no servidor. Tente novamente mais tarde');
        return { data: null, error: 'Erro no servidor', status: 500 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro ${response.status}`;
        toast.error(errorMessage);
        return { data: null, error: errorMessage, status: response.status };
      }

      const data = await response.json();
      return { data, error: null, status: response.status };
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError'
        ? 'A requisição excedeu o tempo limite'
        : 'Falha na conexão. Verifique sua internet';
      
      toast.error(errorMessage);
      return { data: null, error: errorMessage, status: 0 };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export default ApiService;
