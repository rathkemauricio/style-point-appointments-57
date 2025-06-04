import { Customer } from '../models/customer.model';
import { mockCustomers } from '../mocks/mockData';

class CustomerService {
  private customers: Customer[] = [...mockCustomers];
  
  async getCustomers(): Promise<Customer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.customers);
      }, 500);
    });
  }
  
  async getCustomerById(id: string): Promise<Customer | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = this.customers.find((c) => c.id === id);
        resolve(customer);
      }, 300);
    });
  }
  
  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.customers.findIndex((c) => c.id === id);
        if (index === -1) {
          reject(new Error('Customer not found'));
          return;
        }
        
        this.customers[index] = {
          ...this.customers[index],
          ...data
        };
        
        resolve(this.customers[index]);
      }, 300);
    });
  }
  
  async addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer = {
          id: `customer-${Date.now()}`,
          ...customer
        };
        
        this.customers.push(newCustomer);
        resolve(newCustomer);
      }, 300);
    });
  }

  async findCustomerByPhone(phone: string): Promise<Customer | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = this.customers.find(c => c.phone === phone);
        resolve(customer || null);
      }, 300);
    });
  }

  async createCustomer(name: string, phone: string): Promise<Customer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          id: `customer-${Date.now()}`,
          name,
          phone,
          createdAt: new Date().toISOString(),
          totalAppointments: 0
        };
        
        this.customers.push(newCustomer);
        resolve(newCustomer);
      }, 300);
    });
  }
}

export default new CustomerService();
