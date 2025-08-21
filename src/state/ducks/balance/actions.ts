import { action } from "typesafe-actions";
import { BalanceActionTypes } from "./types";

export const balanceConnect = () => {
    return action(BalanceActionTypes.BALANCE_CONNECT);
}

export const balanceDisconnect = () => {
    return action(BalanceActionTypes.BALANCE_DISCONNECT);
}

export const balanceStarted = (connected: boolean, port: any, reader: any, writer: any) => {
    return action(BalanceActionTypes.BALANCE_STARTED, { connected, serialPort: port, serialReader: reader, serialWriter: writer });
}

export const balanceStopped = () => {
    return action(BalanceActionTypes.BALANCE_STOPPED);
}

export const balanceCheckUpdated = () => {
    return action(BalanceActionTypes.BALANCE_CHECK_UPDATED);
}

export const balanceUpdateValues = (mx: number, my: number, mz: number) => {
    return action(BalanceActionTypes.BALANCE_UPDATE_VALUES, { mx, my, mz });
}

export const balanceReadingStart = () => {
    return action(BalanceActionTypes.BALANCE_READING_START);
}

export const balanceReadingStopped = () => {
    return action(BalanceActionTypes.BALANCE_READING_STOPPED);
}
