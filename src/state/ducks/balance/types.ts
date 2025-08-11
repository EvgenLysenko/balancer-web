export interface IBalanceState {
    connected: boolean;
    serialPort: any;
    serialReader: any;
    mx: number;
    my: number;
    mz: number;
}

export const BalanceActionTypes = {
    BALANCE_START: "@@balance/BALANCE_START",
    BALANCE_STARTED: "@@balance/BALANCE_STARTED",
    BALANCE_UPDATE: "@@balance/BALANCE_UPDATE",
    BALANCE_UPDATE_VALUES: "@@balance/BALANCE_UPDATE_VALUES",
};
