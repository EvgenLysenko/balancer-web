export interface IBalanceState {
    connected: boolean;
    serialPort: any;
    serialReader: any;
    serialWriter: any;
    readingStarted: boolean;
    rpm: number;
    angle: number;
}

export const BalanceActionTypes = {
    BALANCE_CONNECT: "@@balance/BALANCE_CONNECT",
    BALANCE_DISCONNECT: "@@balance/BALANCE_DISCONNECT",
    BALANCE_STARTED: "@@balance/BALANCE_STARTED",
    BALANCE_STOPPED: "@@balance/BALANCE_STOPPED",
    BALANCE_CHECK_UPDATED: "@@balance/BALANCE_CHECK_UPDATED",
    BALANCE_UPDATE_DRIVE_STATE: "@@balance/BALANCE_UPDATE_DRIVE_STATE",
    BALANCE_READING_START: "@@balance/BALANCE_READING_START",
    BALANCE_READING_STOPPED: "@@balance/BALANCE_READING_STOPPED",
    BALANCE_ROTATION_START: "@@balance/BALANCE_ROTATION_START",
};
