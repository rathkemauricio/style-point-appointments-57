// Utilitários para tratamento de erros da API
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    // Erros específicos da API
    switch (error.status) {
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 422:
        return error.data?.message || 'Dados inválidos.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      default:
        return error.message || 'Erro desconhecido.';
    }
  }

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet.';
  }

  return error.message || 'Erro desconhecido.';
};

export const formatApiResponse = <T>(data: any): T => {
  // Aqui você pode adicionar transformações nos dados se necessário
  // Por exemplo: converter datas, formatar valores, etc.
  return data;
};

// Função para retry de requisições
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Não retry em erros 4xx (client errors)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Aguardar antes do próximo retry
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw new Error('Max retries exceeded');
};