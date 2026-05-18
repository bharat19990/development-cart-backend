import { Role } from '../enums/role.enum';

export class UserEntity {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
