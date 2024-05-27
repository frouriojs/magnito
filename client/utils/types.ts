import type { AdminUserId, GeneralUserId } from 'api/@types/brandedId';

export type AdminUserDto = {
  id: AdminUserId;
  role: 'admin';
  name: string;
  email: string;
};

export type GeneralUserDto = {
  id: GeneralUserId;
  role: 'general';
  name: string;
  email: string;
};

export type UserDto = AdminUserDto | GeneralUserDto;
