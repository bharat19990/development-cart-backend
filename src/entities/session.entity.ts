import { SessionStatus } from '../enums/session-status.enum';

export class SessionEntity {
  id: string;
  title: string;
  description: string | null;
  status: SessionStatus;
  adminId: string;
  organizationId: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  admin?: {
    id: string;
    email: string;
    role: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial);
  }
}
