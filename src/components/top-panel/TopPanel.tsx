import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balanceConnect, balanceDisconnect, balanceRotationStart } from '../../state/ducks/balance/actions';
import { IApplicationState } from '../../state/ducks';
import { Vector } from './Vector';
import { graphRequest } from '../../state/ducks/graph/actions';

import "./style.css";

interface IProps {
    connected: boolean;
    readingStarted: boolean;
    chartRequested: boolean;
    mx: number;
    my: number;
    mz: number;
    rpm: number;
    balanceConnect: () => void;
    graphRequest: () => void;
    balanceDisconnect: () => void;
    balanceRotationStart: () => void;
}

const TopPanel = ({ connected, readingStarted, chartRequested, mx, my, mz, rpm,
    balanceConnect, balanceDisconnect, graphRequest, balanceRotationStart
}: IProps) => {
    //console.log(mx, my, mz);
    return (
        <div className="top-panel-container">
            <div className="top-panel">
                <div>
                    RPM: {rpm}
                </div>
                <div>
                    Vector: 
                    <Vector x={mx} y={my} z={mz}/>
                </div>
                <Button
                    label="Start"
                    onClick={balanceRotationStart}
                />
                <Button
                    label={chartRequested ? "Chart Requested" : "Request Chart"}
                    onClick={chartRequested ? graphRequest : graphRequest }
                />
                <Button
                    label={readingStarted ? "Reading started" : "Reading NO"}
                />
                <Button
                    label={connected ? "Disconnect" : "Connect"}
                    onClick={connected ? balanceDisconnect : balanceConnect}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state: IApplicationState) => {
    return {
        connected: state.balance.connected,
        mx: state.balance.mx,
        my: state.balance.my,
        mz: state.balance.mz,
        rpm: state.balance.rpm,
        readingStarted: state.balance.readingStarted,
        chartRequested: state.graph.chartRequested,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balanceConnect: () => dispatch(balanceConnect()),
        graphRequest: () => dispatch(graphRequest()),
        balanceDisconnect: () => dispatch(balanceDisconnect()),
        balanceRotationStart: () => dispatch(balanceRotationStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);
