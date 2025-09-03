import { action } from "typesafe-actions";
import { BalancerActionTypes } from "./types";
import { IDriveState } from "../../../balancer/BalancerParser";
import { BalancerRotationStartState, IBalanceStep, IDisbalance } from "../../../balancer/Balancer";

export const balancerConnect = () => {
    return action(BalancerActionTypes.BALANCER_CONNECT);
}

export const balancerDisconnect = () => {
    return action(BalancerActionTypes.BALANCER_DISCONNECT);
}

export const balancerStarted = (connected: boolean, port: any, reader: any, writer: any) => {
    return action(BalancerActionTypes.BALANCER_STARTED, { connected, serialPort: port, serialReader: reader, serialWriter: writer });
}

export const balancerStopped = () => {
    return action(BalancerActionTypes.BALANCER_STOPPED);
}

export const balancerCheckUpdated = () => {
    return action(BalancerActionTypes.BALANCER_CHECK_UPDATED);
}

export const balancerUpdateDriveState = (driveSate: IDriveState) => {
    return action(BalancerActionTypes.BALANCER_UPDATE_DRIVE_STATE, {
        isIdle: driveSate.isIdle,
        rpm: driveSate.rpm,
        angle: driveSate.angle,
     });
}

export const balancerReadingStart = () => {
    return action(BalancerActionTypes.BALANCER_READING_START);
}

export const balancerReadingStopped = () => {
    return action(BalancerActionTypes.BALANCER_READING_STOPPED);
}

export const balancerRotationStart = (rotationStartStage: BalancerRotationStartState, angle: number, weight: number) => {
    return action(BalancerActionTypes.BALANCER_ROTATION_START, { rotationStartStage, startRotationAngle: angle, startRotationWeight: weight });
}

export const balancerStepUpdate = (disbalanceChangeTime: number, step0: IBalanceStep, step1: IBalanceStep, step2: IBalanceStep, stepCalibration: IBalanceStep, stepCurrent: IBalanceStep) => {
    return action(BalancerActionTypes.BALANCER_STEP_UPDATE, { disbalanceChangeTime, step0, step1, step2, stepCalibration, stepCurrent });
}
