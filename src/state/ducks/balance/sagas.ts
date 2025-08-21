import { all, call, delay, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { BalanceActionTypes, IBalanceState } from "./types";
import { balanceReadingStopped, balanceStarted, balanceStopped, balanceUpdateValues } from "./actions";
import ErrorUtils from "../../../utils/ErrorUtils";
import { BalancerParser } from "../../../balancer/BalancerParser";
import { IGraphState } from "../graph/types";
import { chartUpdated } from "../graph/actions";

export const balancerParser = new BalancerParser();

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

function* handleBalanceConnected(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;

        const res = yield call(makeCallPort);

        console.log(res);
        if (res) {
            const port = res as any;
            const { usbProductId, usbVendorId } = port.getInfo();

            const reader = port.readable?.getReader();
            const writer = port.writable?.getWriter();
            console.log(usbProductId, usbVendorId);
            yield put(balanceStarted(!connected, port, reader, writer));
        }
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceStart", err);
    }
}

function* handleBalanceDisconnect(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;
        if (!connected)
            return;

        const res = yield call(makeCallPort);

        const { serialPort, serialReader } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;
        
        yield put(balanceStopped());

    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceDisconnect", err);
    }
}

function* handleBalanceCheckUpdated(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        const { mx, my, mz } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;

        if (mx !== balancerParser.value1 || my !== balancerParser.value2 || mz !== balancerParser.value3) {
            //console.log("handleBalanceUpdate", mx, my, mz, balancerParser.value1, balancerParser.value2, balancerParser.value3);
            yield put(balanceUpdateValues(balancerParser.value1, balancerParser.value2, balancerParser.value3));
        }

        const { updateTime } = (yield select((state: IApplicationState) => state.graph)) as IGraphState;
        if (updateTime !== balancerParser.getChartUpdateTime()) {
            console.log("chartUpdated", updateTime, balancerParser.getChartUpdateTime());
            yield put(chartUpdated(balancerParser.getChartUpdateTime(), balancerParser.chartGetX(), [...balancerParser.chartGetY()]));
        }
        //yield put(balanceUpdateValues(balancerParser.value1, balancerParser.value2, balancerParser.value3));
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceUpdate", err);
    }
}

function* handleBalanceStarted(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        while (true) {
            const { connected, serialReader, mx, my, mz } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;
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

                    if (mx !== balancerParser.value1 || my !== balancerParser.value2 || mz !== balancerParser.value3) {
                        //console.log("handleBalanceUpdate", mx, my, mz, balancerParser.value1, balancerParser.value2, balancerParser.value3);
                        //yield put(balanceUpdateValues(balancerParser.value1, balancerParser.value2, balancerParser.value3));
                    }

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
        yield put(balanceReadingStopped());
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceStarted", err);
    }
}

function* watchBalanceConnected(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_CONNECT, handleBalanceConnected);
}

function* watchBalanceDisconnect(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_DISCONNECT, handleBalanceDisconnect);
}

function* watchBalanceStarted(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_STARTED, handleBalanceStarted);
}

function* watchBalanceCheckUpdated(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_CHECK_UPDATED, handleBalanceCheckUpdated);
}

export function* balanceSaga() {
    yield all([
        fork(watchBalanceConnected),
        fork(watchBalanceDisconnect),
        fork(watchBalanceStarted),
        fork(watchBalanceCheckUpdated),
    ]);
}
