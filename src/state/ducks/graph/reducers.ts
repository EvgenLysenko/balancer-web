import { GraphActionTypes, IGraphState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

export const initialState: IGraphState = {
    x: Array.from({ length: 1000 }, (value, index) => index),
    y: Array.from({ length: 1000 }, (value, index) => index).map((value) => Math.sin(value / 180 * 3.14)),
    tmp: 0,
    updateTime: new Date(),
    chartRequested: false,
}

export const graphReducer = (
    state: IGraphState = initialState,
    action: PayloadAction<TypeConstant, IGraphState>
): IGraphState => {
    switch (action.type) {
        case GraphActionTypes.GRAPH_REQUEST: {
            return { ...state,
                chartRequested: true,
            };
        }
        case GraphActionTypes.GRAPH_UPDATED: {
            return { ...state,
                y: action.payload.y,
                tmp: action.payload.tmp,
            };
        }
        case GraphActionTypes.CHART_UPDATED: {
            console.log(action.payload, action.payload.updateTime);
            return { ...state,
                x: action.payload.x,
                y: action.payload.y,
                updateTime: action.payload.updateTime,
            };
        }
        default:
            return state;
    }
}
