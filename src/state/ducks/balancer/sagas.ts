import { all, call, delay, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { BalancerActionTypes, IBalancerState } from "./types";
import { balancerReadingStopped, balancerStarted, balancerStepUpdate, balancerStopped, balancerUpdateDriveState } from "./actions";
import ErrorUtils from "../../../utils/ErrorUtils";
import { BalancerParser } from "../../../balancer/BalancerParser";
import { IGraphState } from "../graph/types";
import { chartUpdated } from "../graph/actions";
import { BalanceStep, Balancer } from "../../../balancer/Balancer";

export const balancer = new Balancer();
export const balancerParser = new BalancerParser(balancer);

// const makeCallPorts = async (): Promise<any> => {
//     try {
//         if ("serial" in navigator) {
//             const ports = await (navigator.serial as any).getPorts();
//             console.log(ports);
//             return ports;
//         }
//     }
//     catch (err) {
//         console.error(err);
//         return null;
//     }
// }

const makeCallPort = async (): Promise<any> => {
    try {
        if ("serial" in navigator) {
            const port = await (navigator.serial as any).requestPort();
            console.log(port);
            // Wait for the serial port to open.
            await port.open({ baudRate: 115200 });
            return port;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

const makeRead = async (reader: any): Promise<any> => {
    try {
        const { value, done } = await reader.read();
        //console.log(value, done);
        if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            return null;
        }

        return value;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

export const makeWrite = async (writer: any, text: string): Promise<any> => {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        await writer.write(data);
        console.log("Data written successfully:", text);
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

function* handleBalancerConnected(action: PayloadAction<TypeConstant, IBalancerState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;

        const res = yield call(makeCallPort);

        console.log(res);
        if (res) {
            const port = res as any;
            const { usbProductId, usbVendorId } = port.getInfo();

            const reader = port.readable?.getReader();
            const writer = port.writable?.getWriter();
            console.log(usbProductId, usbVendorId);
            yield put(balancerStarted(!connected, port, reader, writer));
        }
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalancerStart", err);
    }
}

function* handleBalancerDisconnect(action: PayloadAction<TypeConstant, IBalancerState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;
        if (!connected)
            return;

        const res = yield call(makeCallPort);

        const { serialPort, serialReader } = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;
        
        yield put(balancerStopped());

    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalancerDisconnect", err);
    }
}

function* handleBalancerCheckUpdated(action: PayloadAction<TypeConstant, IBalancerState>): Generator {
    try {
        const currentState = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;

        if (!Balancer.isSame(currentState, balancerParser)) {
            yield put(balancerUpdateDriveState(balancerParser));
        }

        if (currentState.disbalanceChangeTime !== balancer.getDisbalanceChangeTime) {
            console.log("step change", currentState.disbalanceChangeTime, balancer.getDisbalanceChangeTime);

            yield put(balancerStepUpdate(
                balancer.getDisbalanceChangeTime,
                Balancer.isStepsSame(currentState.step0, balancer.step0) ? currentState.step0 : new BalanceStep(balancer.step0),
                Balancer.isStepsSame(currentState.step1, balancer.step1) ? currentState.step1 : new BalanceStep(balancer.step1),
                Balancer.isStepsSame(currentState.step2, balancer.step2) ? currentState.step2 : new BalanceStep(balancer.step2),
                Balancer.isStepsSame(currentState.stepCalibration, balancer.stepCalibration) ? currentState.stepCalibration : new BalanceStep(balancer.stepCalibration),
                Balancer.isStepsSame(currentState.stepCurrent, balancer.stepCurrent) ? currentState.stepCurrent : new BalanceStep(balancer.stepCurrent),
            ));
        }

        const { updateTime } = (yield select((state: IApplicationState) => state.graph)) as IGraphState;
        if (updateTime !== balancerParser.getChartUpdateTime()) {
            console.log("chartUpdated", updateTime, balancerParser.getChartUpdateTime());
            yield put(chartUpdated(balancerParser.getChartUpdateTime(), balancerParser.chartGetX(), [...balancerParser.chartGetY()]));
        }
        //yield put(balancerUpdateValues(balancerParser.value1, balancerParser.value2, balancerParser.value3));
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalancerUpdate", err);
    }
}

function* handleBalancerStarted(action: PayloadAction<TypeConstant, IBalancerState>): Generator {
    try {
        while (true) {
            const { connected, serialReader } = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;
            if (!connected || serialReader == null)
                break;

            const res = yield call(makeRead, serialReader);
            //console.log(res);
            if (res === null)
                break;

            if (res) {
                const data = res as Uint8Array;
                if (data.length > 0) {
                    balancerParser.parse(res as Uint8Array);

                    yield delay(0);
                    //console.log(1);
                }
                else {
                    yield delay(100);
                    console.log(100);
                }
            }
            else {
                yield delay(1000);
                console.log(1000);
            }
        }

        console.log("stoped");
        yield put(balancerReadingStopped());
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalancerStarted", err);
    }
}

function* handleBalancerRotationStart(action: PayloadAction<TypeConstant, IBalancerState>): Generator {
    try {
        const { connected, startRotationLeftAngle, startRotationLeftWeight, startRotationRightAngle, startRotationRightWeight } = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;
        if (!connected)
            return;

        const { serialWriter } = (yield select((state: IApplicationState) => state.balancer)) as IBalancerState;
        if (serialWriter) {

            const command = "$BAL,START," + action.payload.rotationStartStage + "," + startRotationLeftAngle + "," + startRotationLeftWeight + "," + startRotationRightAngle + "," + startRotationRightWeight + "\n";
            yield call(makeWrite, serialWriter, command);
        }

        //yield put(graphUpdated(y, newTmp));
    }
    catch (err) {
        ErrorUtils.handleDefault("graph - handleGraphRequest", err);
    }
}

function* watchBalancerConnected(): Generator {
    yield takeEvery(BalancerActionTypes.BALANCER_CONNECT, handleBalancerConnected);
}

function* watchBalancerDisconnect(): Generator {
    yield takeEvery(BalancerActionTypes.BALANCER_DISCONNECT, handleBalancerDisconnect);
}

function* watchBalancerStarted(): Generator {
    yield takeEvery(BalancerActionTypes.BALANCER_STARTED, handleBalancerStarted);
}

function* watchBalancerCheckUpdated(): Generator {
    yield takeEvery(BalancerActionTypes.BALANCER_CHECK_UPDATED, handleBalancerCheckUpdated);
}

function* watchBalancerRotationStart(): Generator {
    yield takeEvery(BalancerActionTypes.BALANCER_ROTATION_START, handleBalancerRotationStart);
}

export function* balancerSaga() {
    yield all([
        fork(watchBalancerConnected),
        fork(watchBalancerDisconnect),
        fork(watchBalancerStarted),
        fork(watchBalancerCheckUpdated),
        fork(watchBalancerRotationStart),
    ]);
}
