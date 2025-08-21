import { action } from "typesafe-actions";
import { GraphActionTypes } from "./types";

export const graphRequest = () => {
    return action(GraphActionTypes.GRAPH_REQUEST);
}

export const graphUpdated = (y: number[], tmp: number) => {
    return action(GraphActionTypes.GRAPH_UPDATED, { y, tmp });
}

export const chartUpdated = (updateTime: Date, x: number[], y: number[]) => {
    return action(GraphActionTypes.CHART_UPDATED, { updateTime, x,  y });
}
