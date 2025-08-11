import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { BalanceActionTypes, IBalanceState } from "./types";
import { balanceStarted, balanceUpdateValues } from "./actions";
import ErrorUtils from "../../../utils/ErrorUtils";
import { BalancerParser } from "../../../balancer/BalancerParser";

const balancerParser = new BalancerParser();

const makeCallPorts = async (): Promise<any> => {
    try {
        if ("serial" in navigator) {
            const ports = await (navigator.serial as any).getPorts();
            console.log(ports);
            return ports;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

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

function* handleBalanceStart(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;

        const res = yield call(makeCallPort);

        console.log(res);
        if (res) {
            const port = res as any;
            const { usbProductId, usbVendorId } = port.getInfo();

            const reader = port.readable.getReader();
            console.log(usbProductId, usbVendorId);
            yield put(balanceStarted(!connected, port, reader));
        }

    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceStart", err);
    }
}

function* handleBalanceUpdate(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        const { serialReader, mx, my, mz } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;

        //console.log("handleBalanceUpdate");

        if (serialReader != null) {
            const res = yield call(makeRead, serialReader);
            //console.log(res);
            if (res) {
                balancerParser.parse(res as Uint8Array);

                if (mx !== balancerParser.value1 || my !== balancerParser.value2 || mz !== balancerParser.value3) {
                    console.log("handleBalanceUpdate", mx, my, mz, balancerParser.value1, balancerParser.value2, balancerParser.value3);
                    yield put(balanceUpdateValues(balancerParser.value1, balancerParser.value2, balancerParser.value3));
                }
                //yield put(balanceUpdateValues(balancerParser.value1, balancerParser.value2, balancerParser.value3));
            }
        }
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceUpdate", err);
    }
}

function* watchBalanceStart(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_START, handleBalanceStart);
}

function* watchBalanceUpdate(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_UPDATE, handleBalanceUpdate);
}

export function* balanceSaga() {
    yield all([
        fork(watchBalanceStart),
        fork(watchBalanceUpdate),
    ]);
}
