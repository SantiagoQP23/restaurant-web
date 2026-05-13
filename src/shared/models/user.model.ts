import type { Role } from "./role.model";

export enum TypeIdentification {
  CEDULA = "CEDULA",
  RUC = "RUC",
}

export interface Identification {
  id: string;
  type: TypeIdentification;
  num: string;
}

export interface IPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identification?: Identification;
  numPhone?: string;
}

export interface User {
  id: string;
  username: string;
  person: IPerson;
  online: boolean;
  restaurantRoles: RestaurantRole[];
  isActive: boolean;
  role: Role;
}
