export const USER_TYPES = ["customer", "owner", "admin"] as const;
export type UserType = typeof USER_TYPES[number];
