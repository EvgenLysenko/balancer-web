export interface IGraphState {
    x: number[];
    chartLeft: number[];
    chartRight: number[];
    tmp: number;
    updateTime: number;
    chartRequested: boolean;
}

export const GraphActionTypes = {
    GRAPH_REQUEST: "@@graph/GRAPH_REQUEST",
    GRAPH_UPDATED: "@@graph/GRAPH_UPDATED",
    CHART_UPDATED: "@@chart/CHART_UPDATED",
};
