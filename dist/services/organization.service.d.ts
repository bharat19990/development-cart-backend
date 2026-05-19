import { UserEntity } from '../entities/user.entity';
import { CreateOrganizationDto } from '../validators/create-organization.validator';
export declare class OrganizationService {
    create(dto: CreateOrganizationDto): Promise<{
        organization: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
        };
        account: UserEntity | undefined;
    }>;
}
export declare const organizationService: OrganizationService;
