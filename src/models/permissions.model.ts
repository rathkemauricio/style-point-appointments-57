export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'agenda' | 'services' | 'financial' | 'customers' | 'reviews' | 'settings' | 'admin';
}

export interface UserPermissions {
  userId: string;
  professionalId?: string;
  permissions: string[]; // Array of permission IDs
}

export interface RolePermissions {
  role: 'admin' | 'professional' | 'customer';
  permissions: string[];
}

// Predefined permissions for different functionalities
export const PERMISSIONS: Record<string, Permission> = {
  // Agenda permissions
  VIEW_AGENDA: {
    id: 'view_agenda',
    name: 'Ver Agenda',
    description: 'Visualizar agendamentos na agenda',
    category: 'agenda'
  },
  CREATE_APPOINTMENT: {
    id: 'create_appointment',
    name: 'Criar Agendamento',
    description: 'Criar novos agendamentos',
    category: 'agenda'
  },
  EDIT_APPOINTMENT: {
    id: 'edit_appointment',
    name: 'Editar Agendamento',
    description: 'Modificar agendamentos existentes',
    category: 'agenda'
  },
  DELETE_APPOINTMENT: {
    id: 'delete_appointment',
    name: 'Excluir Agendamento',
    description: 'Remover agendamentos',
    category: 'agenda'
  },

  // Services permissions
  VIEW_SERVICES: {
    id: 'view_services',
    name: 'Ver Serviços',
    description: 'Visualizar lista de serviços',
    category: 'services'
  },
  CREATE_SERVICE: {
    id: 'create_service',
    name: 'Criar Serviço',
    description: 'Adicionar novos serviços',
    category: 'services'
  },
  EDIT_SERVICE: {
    id: 'edit_service',
    name: 'Editar Serviço',
    description: 'Modificar serviços existentes',
    category: 'services'
  },
  DELETE_SERVICE: {
    id: 'delete_service',
    name: 'Excluir Serviço',
    description: 'Remover serviços',
    category: 'services'
  },
  MANAGE_SERVICE_PRICES: {
    id: 'manage_service_prices',
    name: 'Gerenciar Preços',
    description: 'Alterar preços dos serviços',
    category: 'services'
  },

  // Financial permissions
  VIEW_REVENUE: {
    id: 'view_revenue',
    name: 'Ver Faturamento',
    description: 'Visualizar relatórios financeiros',
    category: 'financial'
  },
  EXPORT_REPORTS: {
    id: 'export_reports',
    name: 'Exportar Relatórios',
    description: 'Baixar relatórios em PDF/Excel',
    category: 'financial'
  },

  // Customer permissions
  VIEW_CUSTOMERS: {
    id: 'view_customers',
    name: 'Ver Clientes',
    description: 'Visualizar lista de clientes',
    category: 'customers'
  },
  EDIT_CUSTOMER: {
    id: 'edit_customer',
    name: 'Editar Cliente',
    description: 'Modificar dados dos clientes',
    category: 'customers'
  },
  DELETE_CUSTOMER: {
    id: 'delete_customer',
    name: 'Excluir Cliente',
    description: 'Remover clientes',
    category: 'customers'
  },

  // Reviews permissions
  VIEW_REVIEWS: {
    id: 'view_reviews',
    name: 'Ver Avaliações',
    description: 'Visualizar avaliações dos clientes',
    category: 'reviews'
  },
  RESPOND_REVIEWS: {
    id: 'respond_reviews',
    name: 'Responder Avaliações',
    description: 'Responder às avaliações dos clientes',
    category: 'reviews'
  },

  // Settings permissions
  MANAGE_SETTINGS: {
    id: 'manage_settings',
    name: 'Gerenciar Configurações',
    description: 'Alterar configurações do sistema',
    category: 'settings'
  },
  MANAGE_WORK_HOURS: {
    id: 'manage_work_hours',
    name: 'Gerenciar Horários',
    description: 'Configurar horários de funcionamento',
    category: 'settings'
  },

  // Admin permissions
  MANAGE_USERS: {
    id: 'manage_users',
    name: 'Gerenciar Usuários',
    description: 'Criar, editar e excluir usuários',
    category: 'admin'
  },
  MANAGE_PERMISSIONS: {
    id: 'manage_permissions',
    name: 'Gerenciar Permissões',
    description: 'Alterar permissões de usuários',
    category: 'admin'
  },
  WHITE_LABEL_CONFIG: {
    id: 'white_label_config',
    name: 'Configuração White Label',
    description: 'Configurar marca e aparência',
    category: 'admin'
  }
};

// Default permissions by role - Updated for testing
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: Object.keys(PERMISSIONS), // Admin has all permissions
  professional: [
    // Agenda permissions - barbeiro pode ver e gerenciar agendamentos
    'view_agenda',
    'create_appointment',
    'edit_appointment',
    'delete_appointment',
    
    // Customer permissions - barbeiro pode ver lista de clientes
    'view_customers',
    
    // Basic service viewing
    'view_services'
  ],
  customer: [
    // Cliente pode ver serviços e agendamentos
    'view_services',
    'view_agenda' // Para ver disponibilidade de horários
  ]
};
