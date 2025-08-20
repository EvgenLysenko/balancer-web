import { BalanceActionTypes, IBalanceState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

export const initialState: IBalanceState = {
    connected: false,
    serialPort: undefined,
    serialReader: undefined,
    mx: 0,
    my: 0,
    mz: 0,
}

export const balanceReducer = (
    state: IBalanceState = initialState,
    action: PayloadAction<TypeConstant, IBalanceState>
): IBalanceState => {
    //if (Object.values(BalanceActionTypes).findIndex((value: string) => {return value === action.type}) !== -1)
    //    console.log('state.balanceReducer', action.type, 'state', state, 'payload', action.payload);

    //console.log(action.type);
    switch (action.type) {
        case BalanceActionTypes.BALANCE_START: {
            return state;
        }
        case BalanceActionTypes.BALANCE_STARTED: {
            return { ...state,
                connected: action.payload.connected,
                serialPort: action.payload.serialPort,
                serialReader: action.payload.serialReader,
            };
        }
        case BalanceActionTypes.BALANCE_UPDATE_VALUES: {
            //console.log(BalanceActionTypes.BALANCE_UPDATE_VALUES, action.payload);
            return { ...state,
                mx: action.payload.mx,
                my: action.payload.my,
                mz: action.payload.mz,
            };
        }
        default:
            return state;
    }
}
