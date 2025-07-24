import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Customer } from '../models/customer.model';

class CustomerService extends BaseService {
  async getCustomers(): Promise<Customer[]> {
    return this.get<Customer[]>(API_ENDPOINTS.CUSTOMERS.LIST);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.getCustomers();
  }

  async getCustomerById(id: string): Promise<Customer> {
    return this.get<Customer>(API_ENDPOINTS.CUSTOMERS.DETAILS(id));
  }

  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'totalAppointments'>): Promise<Customer> {
    return this.post<Customer>(API_ENDPOINTS.CUSTOMERS.CREATE, customerData);
  }

  async addCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    return this.createCustomer(customerData);
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    return this.put<Customer>(API_ENDPOINTS.CUSTOMERS.UPDATE(id), customerData);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.CUSTOMERS.DELETE(id));
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return this.get<Customer[]>(`${API_ENDPOINTS.CUSTOMERS.BASE}/search?q=${encodeURIComponent(query)}`);
  }

  async findCustomerByPhone(phone: string): Promise<Customer | null> {
    try {
      const customers = await this.searchCustomers(phone);
      return customers.find(c => c.phone === phone) || null;
    } catch {
      return null;
    }
  }
}

export default new CustomerService();
