import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction, TypeConstant } from "typesafe-actions";
import { IApplicationState } from "..";
import { GraphActionTypes, IGraphState } from "./types";
import ErrorUtils from "../../../utils/ErrorUtils";
import { balancerParser } from "../balance/sagas";
import { IBalanceState } from "../balance/types";

const makeWrite = async (writer: any, text: string): Promise<any> => {
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


function* handleGraphRequest(action: PayloadAction<TypeConstant, IGraphState>): Generator {
    try {
        const { connected } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;
        if (!connected)
            return;

        const { serialWriter } = (yield select((state: IApplicationState) => state.balance)) as IBalanceState;
        if (serialWriter) {
            //yield call(makeWrite, serialWriter, "$BAL,GET,CHART\n");
            yield call(makeWrite, serialWriter, "$BAL,GET,CHART,BULK,10\n");

            balancerParser.chartRequest();
        }

        //yield put(graphUpdated(y, newTmp));
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
