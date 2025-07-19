export interface UserResponse {
  id: number;
  email: string;
  name?: string;
  surname?: string;
  city?: string;
  country?: string;
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
  createdAt: Date;
  updatedAt: Date;
}
