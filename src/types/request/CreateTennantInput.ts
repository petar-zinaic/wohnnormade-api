export type CreateTennantInput = {
  name: string;
  surname: string;
  dateOfBirth?: Date;
  violationType: string;
  description: string;
  city: string;
  country: string;
  createdById: number;
};
