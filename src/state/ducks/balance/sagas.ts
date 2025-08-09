import { all, fork, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { BalanceActionTypes, IBalanceState } from "./types";
import ErrorUtils from "../../../utils/ErrorUtils";

function* handleBalanceStart(action: PayloadAction<TypeConstant, IBalanceState>): Generator {
    try {
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
