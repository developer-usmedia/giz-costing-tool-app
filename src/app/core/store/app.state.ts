import { UserDetails } from '@core/models';

export interface AppState {
    userDetails: UserDetails;
}

export const INITIAL_STATE: AppState = {
    userDetails: {
        email: '',
        password:  '',
    },
};
