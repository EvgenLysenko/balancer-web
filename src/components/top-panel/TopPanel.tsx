import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balancerConnect, balancerDisconnect, balancerRotationStart } from '../../state/ducks/balancer/actions';
import { IApplicationState } from '../../state/ducks';
import { graphRequest } from '../../state/ducks/graph/actions';

import "./style.css";

interface IProps {
    connected: boolean;
    readingStarted: boolean;
    chartRequested: boolean;
    isIdle: boolean;
    rpm: number;
    angle: number;
    balancerConnect: () => void;
    graphRequest: () => void;
    balancerDisconnect: () => void;
    balancerRotationStart: () => void;
}

const TopPanel = ({ connected, readingStarted, chartRequested, isIdle, rpm, angle,
    balancerConnect, balancerDisconnect, graphRequest, balancerRotationStart
}: IProps) => {
    return (
        <div className="top-panel-container">
            <div className="top-panel">
                <div>
                    Angle: {isNaN(angle) ? "--" : angle.toString()}
                </div>
                <div>
                    RPM: {isNaN(rpm) ? "--" : rpm.toString()}
                </div>
                <Button
                    label="Start"
                    onClick={balancerRotationStart}
                    enabled={isIdle}
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
                    onClick={connected ? balancerDisconnect : balancerConnect}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state: IApplicationState) => {
    return {
        connected: state.balancer.connected,
        isIdle: state.balancer.isIdle,
        rpm: state.balancer.rpm,
        angle: state.balancer.angle,
        readingStarted: state.balancer.readingStarted,
        chartRequested: state.graph.chartRequested,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balancerConnect: () => dispatch(balancerConnect()),
        graphRequest: () => dispatch(graphRequest()),
        balancerDisconnect: () => dispatch(balancerDisconnect()),
        balancerRotationStart: () => dispatch(balancerRotationStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);
