import { GraphActionTypes, IGraphState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

export const initialState: IGraphState = {
    x: Array.from({ length: 36 }, (value, index) => index * 10),
    y: Array.from({ length: 36 }, (value, index) => index * 10).map((value) => Math.sin(value / 180 * 3.14)),
    tmp: 0,
}

export const graphReducer = (
    state: IGraphState = initialState,
    action: PayloadAction<TypeConstant, IGraphState>
): IGraphState => {
    switch (action.type) {
        case GraphActionTypes.GRAPH_REQUEST: {
            return state;
        }
        case GraphActionTypes.GRAPH_UPDATED: {
            return { ...state,
                y: action.payload.y,
                tmp: action.payload.tmp,
            };
        }
        default:
            return state;
    }
}
