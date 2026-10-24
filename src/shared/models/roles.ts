export enum Roles {
  ADMIN = "admin",
  OWNER = "owner",
  COOK = "cook",
  WAITER = "waiter",
  CASHIER = "cashier",
}

const ADMIN_LEVEL_ROLES: string[] = [Roles.ADMIN, Roles.OWNER];

/** Same rule as the app's isAdminLevelRole: owner and admin manage the restaurant. */
export const isAdminLevelRole = (role?: string | null): boolean =>
  !!role && ADMIN_LEVEL_ROLES.includes(role);
