import {action} from "typesafe-actions";
import { BalanceActionTypes } from "./types";

export const balanceStart = () => {
    return action(BalanceActionTypes.BALANCE_START);
}

export const balanceStarted = (connected: boolean, port: any, reader: any) => {
    return action(BalanceActionTypes.BALANCE_STARTED, { connected, serialPort: port, serialReader: reader });
}

export const balanceUpdate = () => {
    return action(BalanceActionTypes.BALANCE_UPDATE);
}

export const balanceUpdateValues = (mx: number, my: number, mz: number) => {
    return action(BalanceActionTypes.BALANCE_UPDATE_VALUES, { mx, my, mz });
}
