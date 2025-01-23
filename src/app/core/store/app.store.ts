import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { AppState, INITIAL_STATE } from '@store/app.state';
import { UserDetails } from '@core/models';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Actions from '@store/app.actions';

@State<AppState>({
    name: 'AppState',
    defaults: INITIAL_STATE,
})
@Injectable({ providedIn: 'root' })
export class AppStore {
    @Selector()
    public static userDetails(state: AppState): UserDetails {
        return state.userDetails;
    }

    @Action(Actions.SaveUserDetails)
    public saveUserDetails(context: StateContext<AppState>, action: Actions.SaveUserDetails): void {
        if (!action.userDetails) {
            return;
        }
        context.patchState({ userDetails: action.userDetails });
    }

    @Action(Actions.ClearUserDetails)
    public clearUserDetails(context: StateContext<AppState>, _action: Actions.ClearUserDetails): void {
        context.patchState({ userDetails: undefined });
    }
}
