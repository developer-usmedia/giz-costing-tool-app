import { UserDetails } from '@core/models';

export class SaveUserDetails {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static readonly type = '[App] Save User Details';

    constructor(
        public readonly userDetails: UserDetails,
    ) {}
}
