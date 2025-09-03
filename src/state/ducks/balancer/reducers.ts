import { BalanceStep, BalancerRotationStartState } from "../../../balancer/Balancer";
import { BalancerActionTypes, IBalancerState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

export const initialState: IBalancerState = {
    connected: false,
    serialPort: undefined,
    serialReader: undefined,
    serialWriter: undefined,
    readingStarted: false,
    isIdle: false,
    rpm: NaN,
    angle: NaN,
    disbalanceChangeTime: 0,
    step0: new BalanceStep(),
    step1: new BalanceStep(),
    step2: new BalanceStep(),
    stepCalibration: new BalanceStep(),
    stepCurrent: new BalanceStep(),
    rotationStartStage: undefined as unknown as BalancerRotationStartState,
    startRotationLeftAngle: 0,
    startRotationLeftWeight: 0,
    startRotationRightAngle: 0,
    startRotationRightWeight: 0,
}

export const balancerReducer = (
    state: IBalancerState = initialState,
    action: PayloadAction<TypeConstant, IBalancerState>
): IBalancerState => {
    //if (Object.values(BalanceActionTypes).findIndex((value: string) => {return value === action.type}) !== -1)
    //    console.log('state.balanceReducer', action.type, 'state', state, 'payload', action.payload);

    switch (action.type) {
        case BalancerActionTypes.BALANCER_CONNECT: {
            return { ...state,
                readingStarted: true,
            };
        }
        case BalancerActionTypes.BALANCER_DISCONNECT: {
            return { ...state,
                connected: false,
            };
        }
        case BalancerActionTypes.BALANCER_STARTED: {
            return { ...state,
                connected: action.payload.connected,
                serialPort: action.payload.serialPort,
                serialReader: action.payload.serialReader,
                serialWriter: action.payload.serialWriter,
            };
        }
        case BalancerActionTypes.BALANCER_STOPPED: {
            return { ...state,
                connected: false,
                serialPort: undefined,
                serialReader: undefined,
                serialWriter: undefined,
            };
        }
        case BalancerActionTypes.BALANCER_ROTATION_START: {
            return { ...state,
                rotationStartStage: action.payload.rotationStartStage,
                startRotationLeftAngle: action.payload.startRotationLeftAngle,
                startRotationLeftWeight: action.payload.startRotationLeftWeight,
                startRotationRightAngle: action.payload.startRotationRightAngle,
                startRotationRightWeight: action.payload.startRotationRightWeight,
            };
        }
        case BalancerActionTypes.BALANCER_UPDATE_DRIVE_STATE: {
            return { ...state,
                isIdle: action.payload.isIdle,
                rpm: action.payload.rpm,
                angle: action.payload.angle,
            };
        }
        case BalancerActionTypes.BALANCER_STEP_UPDATE: {
            return { ...state,
                disbalanceChangeTime: action.payload.disbalanceChangeTime,
                step0: action.payload.step0,
                step1: action.payload.step1,
                step2: action.payload.step2,
                stepCalibration: action.payload.stepCalibration,
                stepCurrent: action.payload.stepCurrent,
            };
        }
        case BalancerActionTypes.BALANCER_READING_STOPPED: {
            return { ...state,
                readingStarted: false,
            };
        }
        default:
            return state;
    }
}
