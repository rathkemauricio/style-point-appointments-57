# 🚀 Integração de API - Projeto de Agendamentos

Este projeto já possui uma estrutura completa para integração com APIs REST. Aqui está um guia rápido para começar.

## ✨ O que já está implementado

### ✅ Estrutura Completa
- **BaseService** com Axios e interceptors
- **React Query** para cache e gerenciamento de estado
- **Hooks personalizados** para cada entidade
- **Tratamento de erros** centralizado
- **Autenticação automática** com JWT
- **Configuração centralizada** de endpoints

### ✅ Funcionalidades
- ✅ CRUD completo para todas as entidades
- ✅ Paginação automática
- ✅ Cache inteligente
- ✅ Loading states
- ✅ Error handling
- ✅ Optimistic updates
- ✅ TypeScript completo

## 🚀 Como usar

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3333
VITE_API_TIMEOUT=10000
```

### 2. Usar os hooks da API

```typescript
import { useAppointments, useCustomers, useServices } from '@/hooks/use-api';

const MyComponent = () => {
  // Queries
  const { data: appointments } = useAppointments().useAppointmentsList();
  const { data: customers } = useCustomers().useCustomersList();
  const { data: services } = useServices().useServicesList();

  // Mutations
  const createCustomer = useCustomers().useCreateCustomer();
  const updateCustomer = useCustomers().useUpdateCustomer();
  const deleteCustomer = useCustomers().useDeleteCustomer();

  return (
    <div>
      {/* Seus componentes */}
    </div>
  );
};
```

### 3. Exemplo completo

```typescript
import { useState } from 'react';
import { useCustomers } from '@/hooks/use-api';

const CustomerManager = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { useCustomersList, useCreateCustomer } = useCustomers();
  
  const { data: customers, isLoading } = useCustomersList();
  const createCustomerMutation = useCreateCustomer();

  const handleSubmit = async () => {
    try {
      await createCustomerMutation.mutateAsync(formData);
      setFormData({ name: '', email: '' }); // Limpar formulário
    } catch (error) {
      // Erro tratado automaticamente
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nome"
        />
        <input
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Email"
        />
        <button type="submit" disabled={createCustomerMutation.isPending}>
          {createCustomerMutation.isPending ? 'Salvando...' : 'Criar Cliente'}
        </button>
      </form>

      <div>
        {customers?.data?.map(customer => (
          <div key={customer.id}>
            <h3>{customer.name}</h3>
            <p>{customer.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 📁 Estrutura de arquivos

```
src/
├── config/
│   └── api.config.ts          # Configuração da API
├── hooks/
│   ├── use-api.tsx            # Hooks genéricos da API
│   └── use-auth.tsx           # Hook de autenticação
├── services/
│   ├── base.service.ts        # Serviço base com Axios
│   ├── auth.service.ts        # Serviço de autenticação
│   ├── appointment.service.ts # Serviço de agendamentos
│   ├── customer.service.ts    # Serviço de clientes
│   └── service.service.ts     # Serviço de serviços
└── components/
    └── ApiExample.tsx         # Exemplo de uso
```

## 🎯 Hooks disponíveis

### Hooks Genéricos
```typescript
const { useGet, usePost, usePut, useDelete, usePaginatedQuery } = useApi();
```

### Hooks Específicos
```typescript
// Agendamentos
const { 
  useAppointmentsList, 
  useCreateAppointment, 
  useUpdateAppointment, 
  useDeleteAppointment 
} = useAppointments();

// Clientes
const { 
  useCustomersList, 
  useCreateCustomer, 
  useUpdateCustomer, 
  useDeleteCustomer 
} = useCustomers();

// Serviços
const { 
  useServicesList, 
  useCreateService, 
  useUpdateService, 
  useDeleteService 
} = useServices();
```

## 🔧 Configuração da API

### Endpoints configurados

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    LIST: '/appointments/list',
    CREATE: '/appointments/create',
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
  },
  CUSTOMERS: {
    BASE: '/customers',
    LIST: '/customers/list',
    CREATE: '/customers/create',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
  },
  // ... mais endpoints
};
```

## 🛡️ Tratamento de erros

O sistema trata automaticamente:

- **401**: Redireciona para login
- **403**: Mostra erro de acesso negado
- **404**: Mostra erro de recurso não encontrado
- **422**: Mostra erros de validação
- **500**: Mostra erro do servidor
- **Network**: Mostra erro de conexão

## 🚀 Testando a API

### 1. Acesse o exemplo
Navegue para `/api-example` para ver um exemplo completo de uso da API.

### 2. Configure o backend
Certifique-se de que sua API está rodando em `http://localhost:3333` (ou configure a URL no `.env`).

### 3. Teste as funcionalidades
- Criar, editar e excluir clientes
- Criar serviços
- Criar agendamentos
- Ver listas paginadas

## 📚 Documentação completa

Para mais detalhes, consulte:
- `API_INTEGRATION.md` - Guia completo
- `src/hooks/use-api.tsx` - Implementação dos hooks
- `src/services/base.service.ts` - Serviço base
- `src/config/api.config.ts` - Configuração

## 🎉 Próximos passos

1. **Configure sua API backend** seguindo os endpoints definidos
2. **Teste com dados reais** usando o exemplo em `/api-example`
3. **Customize os hooks** conforme necessário
4. **Adicione novos endpoints** em `api.config.ts`
5. **Implemente validações** com Zod ou Yup

---

A integração está pronta para uso! 🚀 