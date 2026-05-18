import { Role } from '../enums/role.enum';

export interface RequestUser {
  id: string;
  email: string;
  role: Role;
  profileCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
