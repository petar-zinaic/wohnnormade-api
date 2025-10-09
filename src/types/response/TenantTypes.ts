export interface TenantResponse {
  id: number;
  name: string;
  surname: string;
  violationType: string;
  description: string;
  city: string;
  country: string;
  createdById: number;
  createdBy?: {
    id: number;
    email: string;
    name?: string;
    surname?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantListResponse {
  id: number;
  name: string;
  surname: string;
  violationType: string;
  description: string;
  city: string;
  country: string;
  createdById: number;
  createdBy?: {
    id: number;
    email: string;
    name?: string;
    surname?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
