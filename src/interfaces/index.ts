export interface Company {
    id: string;
    name: string;
    registrationNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateCompanyRequest {
    name: string;
    registrationNumber: string;
  }
  
  export interface CreateServiceRequest {
    name: string;
    description: string;
    price: number;
    companyId: string;
  }