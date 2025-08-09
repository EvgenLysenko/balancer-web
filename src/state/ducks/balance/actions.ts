import {action} from "typesafe-actions";
import { BalanceActionTypes } from "./types";

export const balanceStart = () => {
    return action(BalanceActionTypes.BALANCE_START);
}

export const balanceStarted = (connected: boolean) => {
    return action(BalanceActionTypes.BALANCE_STARTED, { connected });
}
