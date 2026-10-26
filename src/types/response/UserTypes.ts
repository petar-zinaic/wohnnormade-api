export interface TenantData {
  id: number;
  name: string;
  surname: string;
  dateOfBirth: Date | null;
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
  name: string | null;
  surname: string | null;
  city: string | null;
  country: string | null;
  tenants: TenantData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  id: number;
  email: string;
  name: string | null;
  surname: string | null;
  city: string | null;
  country: string | null;
  tenants: TenantData[];
  createdAt: Date;
  updatedAt: Date;
}
