import { BalancerRotationStartState, IBalanceStep } from "../../../balancer/Balancer";
import { IDriveState } from "../../../balancer/BalancerParser";

export interface IBalancerState extends IDriveState {
    connected: boolean;
    serialPort: any;
    serialReader: any;
    serialWriter: any;
    readingStarted: boolean;
    disbalanceChangeTime: number;
    step0: IBalanceStep;
    step1: IBalanceStep;
    step2: IBalanceStep;
    stepCalibration: IBalanceStep;
    stepCurrent: IBalanceStep;
    rotationStartStage: BalancerRotationStartState;
    startRotationLeftAngle: number;
    startRotationLeftWeight: number;
    startRotationRightAngle: number;
    startRotationRightWeight: number;
}

export const BalancerActionTypes = {
    BALANCER_CONNECT: "@@balancer/BALANCER_CONNECT",
    BALANCER_DISCONNECT: "@@balancer/BALANCER_DISCONNECT",
    BALANCER_STARTED: "@@balancer/BALANCER_STARTED",
    BALANCER_STOPPED: "@@balancer/BALANCER_STOPPED",
    BALANCER_CHECK_UPDATED: "@@balancer/BALANCER_CHECK_UPDATED",
    BALANCER_UPDATE_DRIVE_STATE: "@@balancer/BALANCER_UPDATE_DRIVE_STATE",
    BALANCER_READING_START: "@@balancer/BALANCER_READING_START",
    BALANCER_READING_STOPPED: "@@balancer/BALANCER_READING_STOPPED",
    BALANCER_ROTATION_START: "@@balancer/BALANCER_ROTATION_START",
    BALANCER_STEP_UPDATE: "@@balancer/BALANCER_STEP_UPDATE",
};
