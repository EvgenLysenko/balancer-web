import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";
import { IBalanceState } from "./balance/types";
import { balanceReducer } from "./balance/reducers";
import { balanceSaga } from "./balance/sagas";
import { IGraphState } from "./graph/types";
import { graphReducer } from "./graph/reducers";
import { graphSaga } from "./graph/sagas";

export interface IApplicationState {
    balance: IBalanceState;
    graph: IGraphState;
}

export const rootReducer = combineReducers<IApplicationState>({
    balance: balanceReducer,
    graph: graphReducer,
});

export function* rootSaga() {
    yield all([
        fork(balanceSaga),
        fork(graphSaga),
    ]);
}
