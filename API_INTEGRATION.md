# Integração de API - Guia Completo

Este guia explica como integrar e usar APIs REST no projeto de agendamentos de barbearia.

## 📋 Índice

1. [Estrutura da API](#estrutura-da-api)
2. [Configuração](#configuração)
3. [Hooks Personalizados](#hooks-personalizados)
4. [Como Usar](#como-usar)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Cache e Performance](#cache-e-performance)

## 🏗️ Estrutura da API

### Configuração Centralizada

A configuração da API está centralizada em `src/config/api.config.ts`:

```typescript
export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3333',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    retryAttempts: 3,
    retryDelay: 1000,
    endpoints: API_ENDPOINTS
};
```

### Endpoints Organizados

Todos os endpoints estão organizados por funcionalidade:

```typescript
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        // ...
    },
    APPOINTMENTS: {
        BASE: '/appointments',
        LIST: '/appointments/list',
        CREATE: '/appointments/create',
        // ...
    },
    // ...
};
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
VITE_API_URL=http://localhost:3333
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret-here

# Environment
VITE_NODE_ENV=development
```

### 2. Base Service

O `BaseService` (`src/services/base.service.ts`) fornece:

- Interceptors para autenticação automática
- Tratamento centralizado de erros
- Timeout configurável
- Headers padrão

### 3. React Query

O projeto usa React Query para:

- Cache inteligente
- Sincronização em background
- Gerenciamento de estado do servidor
- Otimistic updates

## 🎣 Hooks Personalizados

### Hook Genérico (`useApi`)

```typescript
const { useGet, usePost, usePut, useDelete, usePaginatedQuery } = useApi();
```

### Hooks Específicos

```typescript
// Agendamentos
const { useAppointmentsList, useCreateAppointment } = useAppointments();

// Clientes
const { useCustomersList, useCreateCustomer } = useCustomers();

// Serviços
const { useServicesList, useCreateService } = useServices();
```

## 📖 Como Usar

### 1. Queries (GET)

```typescript
import { useAppointments } from '@/hooks/use-api';

const MyComponent = () => {
  const { useAppointmentsList } = useAppointments();
  
  const { 
    data: appointments, 
    isLoading, 
    error 
  } = useAppointmentsList(1, 10);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {appointments?.data?.map(appointment => (
        <div key={appointment.id}>{appointment.title}</div>
      ))}
    </div>
  );
};
```

### 2. Mutations (POST/PUT/DELETE)

```typescript
import { useCustomers } from '@/hooks/use-api';

const CustomerForm = () => {
  const { useCreateCustomer } = useCustomers();
  const createCustomerMutation = useCreateCustomer();

  const handleSubmit = async (formData) => {
    try {
      await createCustomerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      // Sucesso! O cache será invalidado automaticamente
    } catch (error) {
      // Erro tratado automaticamente pelo hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      <button 
        type="submit" 
        disabled={createCustomerMutation.isPending}
      >
        {createCustomerMutation.isPending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
};
```

### 3. Queries Paginadas

```typescript
const { usePaginatedQuery } = useApi();

const { 
  data: paginatedData, 
  isLoading 
} = usePaginatedQuery(
  ['customers', 'list'], 
  '/customers/list', 
  1, // página
  10 // limite por página
);

// Acessar dados e paginação
const customers = paginatedData?.data || [];
const pagination = paginatedData?.pagination;
```

## 💡 Exemplos Práticos

### Exemplo 1: Lista de Agendamentos com Filtros

```typescript
import { useAppointments } from '@/hooks/use-api';

const AppointmentsList = ({ date, professionalId }) => {
  const { useAppointmentsByDate } = useAppointments();
  
  const { data: appointments, isLoading } = useAppointmentsByDate(date);

  const filteredAppointments = appointments?.data?.filter(
    apt => apt.professionalId === professionalId
  ) || [];

  return (
    <div>
      {filteredAppointments.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
};
```

### Exemplo 2: Formulário com Validação

```typescript
import { useForm } from 'react-hook-form';
import { useCustomers } from '@/hooks/use-api';

const CustomerForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { useCreateCustomer } = useCustomers();
  const createCustomerMutation = useCreateCustomer();

  const onSubmit = async (data) => {
    try {
      await createCustomerMutation.mutateAsync(data);
      // Formulário será limpo automaticamente após sucesso
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: 'Nome é obrigatório' })}
        placeholder="Nome"
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <button type="submit" disabled={createCustomerMutation.isPending}>
        Criar Cliente
      </button>
    </form>
  );
};
```

### Exemplo 3: CRUD Completo

```typescript
import { useState } from 'react';
import { useCustomers } from '@/hooks/use-api';

const CustomerManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { 
    useCustomersList, 
    useCreateCustomer, 
    useUpdateCustomer, 
    useDeleteCustomer 
  } = useCustomers();

  const { data: customers } = useCustomersList();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleCreate = async (data) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id, data) => {
    await updateMutation.mutateAsync({ id, ...data });
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync();
  };

  return (
    <div>
      {/* Lista de clientes */}
      {customers?.data?.map(customer => (
        <div key={customer.id}>
          <span>{customer.name}</span>
          <button onClick={() => setSelectedCustomer(customer)}>
            Editar
          </button>
          <button onClick={() => handleDelete(customer.id)}>
            Excluir
          </button>
        </div>
      ))}
      
      {/* Formulário */}
      <CustomerForm 
        customer={selectedCustomer}
        onSubmit={selectedCustomer ? handleUpdate : handleCreate}
      />
    </div>
  );
};
```

## ⚠️ Tratamento de Erros

### Erros Automáticos

O sistema trata automaticamente:

- **401 Unauthorized**: Redireciona para login
- **403 Forbidden**: Mostra mensagem de acesso negado
- **404 Not Found**: Mostra mensagem de recurso não encontrado
- **422 Validation Error**: Mostra erros de validação
- **500 Server Error**: Mostra mensagem de erro do servidor
- **Network Error**: Mostra mensagem de erro de conexão

### Tratamento Customizado

```typescript
const createCustomerMutation = useCreateCustomer({
  onError: (error) => {
    // Tratamento customizado
    if (error.status === 409) {
      toast.error('Cliente já existe com este email');
    }
  },
  onSuccess: (data) => {
    // Ação customizada após sucesso
    router.push('/customers');
  }
});
```

## 🚀 Cache e Performance

### Configuração de Cache

```typescript
// No hook useGet
const { data } = useGet(['customers', 'list'], '/customers/list', {
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000,   // 10 minutos
  refetchOnWindowFocus: false,
  refetchOnMount: false
});
```

### Invalidação de Cache

```typescript
const { queryClient } = useApi();

// Invalidar queries específicas
queryClient.invalidateQueries({ queryKey: ['customers'] });

// Invalidar múltiplas queries
queryClient.invalidateQueries({ 
  queryKey: ['appointments', 'customers', 'services'] 
});
```

### Prefetch

```typescript
const { prefetch } = useApi();

// Prefetch de dados
useEffect(() => {
  prefetch(['customers', 'list'], '/customers/list');
}, []);
```

## 🔧 Configuração Avançada

### Interceptors Customizados

```typescript
// Em src/services/base.service.ts
this.api.interceptors.request.use(
  (config) => {
    // Adicionar headers customizados
    config.headers['X-Custom-Header'] = 'value';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Retry Logic

```typescript
const { useGet } = useApi();

const { data } = useGet(['data'], '/endpoint', {
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

## 📝 Boas Práticas

1. **Use os hooks específicos** em vez do hook genérico quando possível
2. **Sempre trate estados de loading** nos componentes
3. **Use optimistic updates** para melhor UX
4. **Configure staleTime** apropriadamente para cada tipo de dado
5. **Invalide cache** após mutations
6. **Use prefetch** para dados que serão necessários em breve
7. **Mantenha queries simples** e específicas
8. **Use paginação** para listas grandes

## 🐛 Debugging

### React Query DevTools

Adicione o DevTools para debug:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Seu app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Logs de Debug

```typescript
const { data } = useGet(['customers'], '/customers', {
  onSuccess: (data) => {
    console.log('Dados carregados:', data);
  },
  onError: (error) => {
    console.error('Erro na query:', error);
  }
});
```

## 📚 Recursos Adicionais

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Este guia cobre os aspectos principais da integração de API no projeto. Para dúvidas específicas, consulte a documentação dos hooks ou entre em contato com a equipe de desenvolvimento. 