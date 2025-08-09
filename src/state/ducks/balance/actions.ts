import {action} from "typesafe-actions";
import { BalanceActionTypes } from "./types";

export const balanceStart = () =>
    action(BalanceActionTypes.BALANCE_START);
