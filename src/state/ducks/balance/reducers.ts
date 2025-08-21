import { BalanceActionTypes, IBalanceState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

export const initialState: IBalanceState = {
    connected: false,
    serialPort: undefined,
    serialReader: undefined,
    serialWriter: undefined,
    mx: 0,
    my: 0,
    mz: 0,
    readingStarted: false,
}

export const balanceReducer = (
    state: IBalanceState = initialState,
    action: PayloadAction<TypeConstant, IBalanceState>
): IBalanceState => {
    //if (Object.values(BalanceActionTypes).findIndex((value: string) => {return value === action.type}) !== -1)
    //    console.log('state.balanceReducer', action.type, 'state', state, 'payload', action.payload);

    switch (action.type) {
        case BalanceActionTypes.BALANCE_CONNECT: {
            return { ...state,
                readingStarted: true,
            };
        }
        case BalanceActionTypes.BALANCE_DISCONNECT: {
            return { ...state,
                connected: false,
            };
        }
        case BalanceActionTypes.BALANCE_STARTED: {
            return { ...state,
                connected: action.payload.connected,
                serialPort: action.payload.serialPort,
                serialReader: action.payload.serialReader,
                serialWriter: action.payload.serialWriter,
            };
        }
        case BalanceActionTypes.BALANCE_STOPPED: {
            return { ...state,
                connected: false,
                serialPort: undefined,
                serialReader: undefined,
                serialWriter: undefined,
            };
        }
        case BalanceActionTypes.BALANCE_UPDATE_VALUES: {
            return { ...state,
                mx: action.payload.mx,
                my: action.payload.my,
                mz: action.payload.mz,
            };
        }
        case BalanceActionTypes.BALANCE_READING_STOPPED: {
            return { ...state,
                readingStarted: false,
            };
        }
        default:
            return state;
    }
}
