import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { BalanceActionTypes, IBalanceState } from "./types";
import { balanceStarted } from "./actions";
import ErrorUtils from "../../../utils/ErrorUtils";
//import { SerialPort } from 'serialport'

//const serialport = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 });

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
            return port;
        }
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
        //const res = SerialPort.list();
        console.log(res);
            // The Web Serial API is supported.
        //}

        yield put(balanceStarted(!connected));
    }
    catch (err) {
        ErrorUtils.handleDefault("balancer - handleBalanceStart", err);
    }
}

function* watchBalanceStart(): Generator {
    yield takeEvery(BalanceActionTypes.BALANCE_START, handleBalanceStart);
}

export function* balanceSaga() {
    yield all([
        fork(watchBalanceStart),
    ]);
}
