
import ApiService from './api.service';
import appConfig from '../config/appConfig';
import { Customer } from '../models/customer.model';

// Import mock data for development
import { mockCustomers } from '../mocks/mockData';

class CustomerService {
  private api: ApiService;
  
  constructor() {
    this.api = new ApiService(appConfig.api.baseUrl, appConfig.api.timeout);
  }
  
  /**
   * Find customer by phone number
   */
  async findCustomerByPhone(phone: string): Promise<Customer | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get('/customers/findByPhone', { phone });
      
      // For development, we're using mock data
      const customer = mockCustomers.find(c => 
        c.phone.replace(/[^\d]/g, '').includes(phone.replace(/[^\d]/g, ''))
      );
      return customer || null;
    } catch (error) {
      console.error(`Failed to find customer by phone ${phone}:`, error);
      return null;
    }
  }
  
  /**
   * Create a new customer
   */
  async createCustomer(name: string, phone: string): Promise<Customer | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.post('/customers', { name, phone });
      
      // For development, we simulate a successful creation
      const newCustomer: Customer = {
        id: `new-${Date.now()}`,
        name,
        phone,
        createdAt: new Date().toISOString(),
        totalAppointments: 0
      };
      
      return newCustomer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      return null;
    }
  }
}

export default new CustomerService();
