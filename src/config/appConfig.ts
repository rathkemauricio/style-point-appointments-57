
/**
 * Main application configuration
 */
interface AppConfig {
  /** Set to true for barbershops with multiple professionals */
  isMultiProfessional: boolean;
  
  /** Business information */
  business: {
    name: string;
    address: string;
    city: string;
    phone: string;
    openHours: string;
    description: string;
    latitude: number;
    longitude: number;
    logoUrl: string;
    coverImageUrl: string;
  };
  
  /** API configuration */
  api: {
    baseUrl: string;
    timeout: number;
  };
}

const appConfig: AppConfig = {
  isMultiProfessional: false,
  
  business: {
    name: "Barbearia Estilo",
    address: "Rua das Flores, 123",
    city: "São Paulo - SP",
    phone: "(11) 98765-4321",
    openHours: "Seg-Sáb: 9h às 19h",
    description: "Cortes modernos e atendimento de qualidade",
    latitude: -23.550520,
    longitude: -46.633308,
    logoUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e752b3d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
  },
  
  api: {
    baseUrl: "https://api.barbearia.com",
    timeout: 10000
  }
};

export default appConfig;
