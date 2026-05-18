import { SponsorshipEntity } from '../entities/sponsorship.entity';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
import { SponsorDto } from '../validators/sponsor.validator';
export declare class SponsorshipService {
    sponsor(organizationUser: RequestUser, activeSession: ActiveSessionContext, dto: SponsorDto): Promise<{
        sponsorship: SponsorshipEntity;
    }>;
    private resolveOrganizationId;
}
export declare const sponsorshipService: SponsorshipService;
