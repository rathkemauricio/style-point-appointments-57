interface WhiteLabelConfig {
  business: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    openHours: string;
    logoUrl: string;
    coverImageUrl: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  theme: {
    colors: {
      light: {
        primary: string;
        secondary: string;
        accent: string;
      };
      dark: {
        primary: string;
        secondary: string;
        accent: string;
      };
    };
    fonts: {
      primary: string;
      secondary?: string;
    };
    borderRadius?: string;
  };
  features: {
    enableReviews: boolean;
    enableNotifications: boolean;
    enableSocialLogin: boolean;
    enableWhatsapp: boolean;
    maxServicesPerAppointment: number;
    maxAppointmentsPerDay: number;
    appointmentDuration: number; // em minutos
    cancellationDeadline: number; // em horas
  };
  customization: {
    allowProfessionalCustomization: boolean; // Se profissionais individuais podem personalizar
    allowBusinessCustomization: boolean; // Se negócios podem personalizar
  };
}

const defaultConfig: WhiteLabelConfig = {
  business: {
    name: "Style Point",
    description: "Barbearia moderna e profissional",
    address: "Rua Exemplo, 123 - Centro",
    phone: "(11) 99999-9999",
    email: "contato@stylepoint.com",
    openHours: "Seg-Sáb: 9h às 19h",
    logoUrl: "/images/logo.png",
    coverImageUrl: "/images/cover.jpg",
    socialMedia: {
      instagram: "https://instagram.com/stylepoint",
      facebook: "https://facebook.com/stylepoint",
    }
  },
  theme: {
    colors: {
      light: {
        primary: "#C4804E",
        secondary: "#FBE6D4",
        accent: "#8B4513"
      },
      dark: {
        primary: "#8B4513",
        secondary: "#2C1810",
        accent: "#C4804E"
      }
    },
    fonts: {
      primary: "Poppins",
    },
    borderRadius: "0.5rem"
  },
  features: {
    enableReviews: true,
    enableNotifications: true,
    enableSocialLogin: true,
    enableWhatsapp: true,
    maxServicesPerAppointment: 3,
    maxAppointmentsPerDay: 20,
    appointmentDuration: 30,
    cancellationDeadline: 24
  },
  customization: {
    allowProfessionalCustomization: true,
    allowBusinessCustomization: true
  }
};

export type { WhiteLabelConfig };
export { defaultConfig }; 