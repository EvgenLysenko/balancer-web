import { all, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { GraphActionTypes, IGraphState } from "./types";
import { graphUpdated } from "./actions";
import ErrorUtils from "../../../utils/ErrorUtils";

function* handleGraphRequest(action: PayloadAction<TypeConstant, IGraphState>): Generator {
    try {
        const { x, tmp } = (yield select((state: IApplicationState) => state.graph)) as IGraphState;

        //console.log(x);
        let newTmp = tmp + 30;
        const y = x.map((value) => Math.sin((value + newTmp) / 180 * 3.14));

        //console.log(y);
        yield put(graphUpdated(y, newTmp));
    }
    catch (err) {
        ErrorUtils.handleDefault("graph - handleGraphRequest", err);
    }
}

function* watchGraphRequest(): Generator {
    yield takeEvery(GraphActionTypes.GRAPH_REQUEST, handleGraphRequest);
}

export function* graphSaga() {
    yield all([
        fork(watchGraphRequest),
    ]);
}
