import { all, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { BalanceActionTypes, IBalanceState } from "./types";
import { balanceStarted } from "./actions";
import ErrorUtils from "../../../utils/ErrorUtils";

function* handleBalanceStart(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;

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
