import type { RestaurantRole, Role } from "./role.model";

export enum TypeIdentification {
  CEDULA = "CEDULA",
  RUC = "RUC",
}

export interface Identification {
  id: string;
  type: TypeIdentification;
  num: string;
}

export interface Person {
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
  person: Person;
  online: boolean;
  restaurantRoles: RestaurantRole[];
  isActive: boolean;
  role: Role;
}
