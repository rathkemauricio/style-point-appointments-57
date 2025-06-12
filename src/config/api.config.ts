/**
 * API endpoint configuration
 * All endpoints used in the application should be defined here
 */
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        REFRESH_TOKEN: '/auth/refresh-token',
    },

    // Admin endpoints
    ADMIN: {
        USERS: '/admin/users',
        CREATE_USER: '/admin/users/create',
        UPDATE_USER: (id: string) => `/admin/users/${id}`,
        DELETE_USER: (id: string) => `/admin/users/${id}`,
        SETTINGS: '/admin/settings',
    },

    // Service endpoints
    SERVICES: {
        BASE: '/services',
        LIST: '/services/list',
        CREATE: '/services/create',
        DETAILS: (id: string) => `/services/${id}`,
        UPDATE: (id: string) => `/services/${id}`,
        DELETE: (id: string) => `/services/${id}`,
    },

    // Customer endpoints
    CUSTOMERS: {
        BASE: '/customers',
        LIST: '/customers/list',
        CREATE: '/customers/create',
        DETAILS: (id: string) => `/customers/${id}`,
        UPDATE: (id: string) => `/customers/${id}`,
        DELETE: (id: string) => `/customers/${id}`,
        BY_PHONE: (phone: string) => `/customers/phone/${phone}`,
    },

    // Appointment endpoints
    APPOINTMENTS: {
        BASE: '/appointments',
        LIST: '/appointments/list',
        CREATE: '/appointments/create',
        DETAILS: (id: string) => `/appointments/${id}`,
        UPDATE: (id: string) => `/appointments/${id}`,
        DELETE: (id: string) => `/appointments/${id}`,
        BY_DATE: (date: string) => `/appointments/date/${date}`,
        BY_CUSTOMER: (customerId: string) => `/appointments/customer/${customerId}`,
        BY_PROFESSIONAL: (professionalId: string) => `/appointments/professional/${professionalId}`,
    },

    // Availability endpoints
    AVAILABILITY: {
        DATES: '/availability/dates',
        SLOTS: (date: string) => `/availability/slots/${date}`,
        BY_PROFESSIONAL: (professionalId: string, date: string) =>
            `/availability/professional/${professionalId}/date/${date}`,
    },

    // Fidelity endpoints
    FIDELITY: {
        BASE: '/fidelity',
        ADD_POINTS: '/fidelity/add-points',
        RESET_POINTS: '/fidelity/reset-points',
        DETAILS: (customerId: string) => `/fidelity/customer/${customerId}`,
        HISTORY: (customerId: string) => `/fidelity/customer/${customerId}/history`,
    }
};

/**
 * API configuration
 */
export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3333',
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    endpoints: {
        // Auth
        login: '/auth/login',
        register: '/auth/register',
        refreshToken: '/auth/refresh-token',

        // Users
        users: '/users',
        userProfile: '/users/profile',

        // Services
        services: '/services',

        // Customers
        customers: '/customers',
        customerByPhone: '/customers/phone',

        // Appointments
        appointments: '/appointments',
        appointmentsByDate: '/appointments/date',
        appointmentsByCustomer: '/appointments/customer',
        appointmentsByProfessional: '/appointments/professional',

        // Availability
        availability: '/availability',
        availabilityByDate: '/availability/date',
        availabilityByProfessional: '/availability/professional',

        // Professionals
        professionals: '/professionals',

        // Fidelity
        fidelityPoints: '/fidelity/points',
        fidelityRewards: '/fidelity/rewards'
    }
}; 