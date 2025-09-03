import { GraphActionTypes, IGraphState } from "./types";
import { PayloadAction, TypeConstant } from "typesafe-actions";

const length = 255;

export const initialState: IGraphState = {
    x: Array.from({ length: length }, (value, index) => index),
    chartLeft: Array.from({ length: length }, (value, index) => NaN),
    chartRight: Array.from({ length: length }, (value, index) => NaN),
    updateTime: 0,
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
                chartLeft: action.payload.chartLeft,
                chartRight: action.payload.chartRight,
            };
        }
        case GraphActionTypes.CHART_UPDATED: {
            console.log(action.payload, action.payload.updateTime);
            return { ...state,
                x: action.payload.x,
                chartLeft: action.payload.chartLeft,
                chartRight: action.payload.chartRight,
                updateTime: action.payload.updateTime,
            };
        }
        default:
            return state;
    }
}
