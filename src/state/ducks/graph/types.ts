export interface IGraphState {
    x: number[];
    y: number[];
    tmp: number;
}

export const GraphActionTypes = {
    GRAPH_REQUEST: "@@graph/GRAPH_REQUEST",
    GRAPH_UPDATED: "@@graph/GRAPH_UPDATED",
};
