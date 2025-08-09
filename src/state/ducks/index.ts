import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";
import { IBalanceState } from "./balance/types";
import { balanceReducer } from "./balance/reducers";
import { balanceSaga } from "./balance/sagas";

export interface IApplicationState {
    balance: IBalanceState;
}

export const rootReducer = combineReducers<IApplicationState>({
    balance: balanceReducer,
});

export function* rootSaga() {
    yield all([
        fork(balanceSaga),
    ]);
}
