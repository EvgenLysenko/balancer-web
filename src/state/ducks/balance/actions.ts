import { action } from "typesafe-actions";
import { BalanceActionTypes } from "./types";
import { IDriveState } from "../../../balancer/BalancerParser";

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

export const balanceUpdateDriveState = (rpm: number, angle: number) => {
    return action(BalanceActionTypes.BALANCE_UPDATE_DRIVE_STATE, { rpm, angle });
}

export const balanceReadingStart = () => {
    return action(BalanceActionTypes.BALANCE_READING_START);
}

export const balanceReadingStopped = () => {
    return action(BalanceActionTypes.BALANCE_READING_STOPPED);
}

export const balanceRotationStart = () => {
    return action(BalanceActionTypes.BALANCE_ROTATION_START);
}

