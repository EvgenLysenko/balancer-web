import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";
import { IBalancerState } from "./balancer/types";
import { balancerReducer } from "./balancer/reducers";
import { balancerSaga } from "./balancer/sagas";
import { IGraphState } from "./graph/types";
import { graphReducer } from "./graph/reducers";
import { graphSaga } from "./graph/sagas";

export interface IApplicationState {
    balancer: IBalancerState;
    graph: IGraphState;
}

export const rootReducer = combineReducers<IApplicationState>({
    balancer: balancerReducer,
    graph: graphReducer,
});

export function* rootSaga() {
    yield all([
        fork(balancerSaga),
        fork(graphSaga),
    ]);
}
