export interface TenantData {
  id: number;
  name: string;
  surname: string;
  dateOfBirth?: Date;
  violationType: string;
  description: string;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name?: string;
  surname?: string;
  city?: string;
  country?: string;
  tenants: TenantData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  id: number;
  email: string;
  name?: string;
  surname?: string;
  city?: string;
  country?: string;
  tenants: TenantData[];
  createdAt: Date;
  updatedAt: Date;
}
