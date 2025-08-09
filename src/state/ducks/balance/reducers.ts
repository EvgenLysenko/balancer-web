import { BalanceActionTypes, IBalanceState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

export const initialState: IBalanceState = {
    connected: false,
}

export const balanceReducer = (
    state: IBalanceState = initialState,
    action: PayloadAction<TypeConstant, IBalanceState>
): IBalanceState => {
    if (Object.values(BalanceActionTypes).findIndex((value: string) => {return value === action.type}) !== -1)
        console.log('state.balanceReducer', action.type, 'state', state, 'payload', action.payload);

    switch (action.type) {
        case BalanceActionTypes.BALANCE_START: {
            return state;
        }
        case BalanceActionTypes.BALANCE_STARTED: {
            return { ...state,
                connected: action.payload.connected,
            };
        }
        default:
            return state;
    }
}
