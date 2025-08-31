import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balancerConnect, balancerDisconnect, balancerRotationStart } from '../../state/ducks/balancer/actions';
import { IApplicationState } from '../../state/ducks';
import { graphRequest } from '../../state/ducks/graph/actions';
import { BalancerRotationStartState, IDisbalance } from '../../balancer/Balancer';
import DisbalanceStartButton from '../disbalance-start-button/DisbalanceStartButton';

import "./style.css";

interface IProps {
    connected: boolean;
    readingStarted: boolean;
    chartRequested: boolean;
    isIdle: boolean;
    rpm: number;
    angle: number;
    disbalance: IDisbalance;
    disbalanceZero: IDisbalance;
    disbalanceLeft: IDisbalance;
    disbalanceRight: IDisbalance;
    balancerConnect: () => void;
    graphRequest: () => void;
    balancerDisconnect: () => void;
    balancerRotationStart: (rotationStartStage: BalancerRotationStartState) => void;
}

const TopPanel = ({ connected, readingStarted, chartRequested, isIdle, rpm, angle, disbalance, disbalanceZero, disbalanceLeft, disbalanceRight,
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
                <DisbalanceStartButton
                    label="Start"
                    disbalance={disbalanceZero}
                    rotationStartStage={BalancerRotationStartState.Zero}
                />
                <DisbalanceStartButton
                    label="Start L"
                    disbalance={disbalanceLeft}
                    rotationStartStage={BalancerRotationStartState.Left}
                />
                <DisbalanceStartButton
                    label="Start R"
                    disbalance={disbalanceRight}
                    rotationStartStage={BalancerRotationStartState.Right}
                />
                <Button
                    label={chartRequested ? "Chart Requested" : "Request Chart"}
                    onClick={chartRequested ? graphRequest : graphRequest }
                />
                <DisbalanceStartButton
                    label="Start Test"
                    disbalance={disbalance}
                    rotationStartStage={BalancerRotationStartState.Common}
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
        disbalance: state.balancer.disbalance,
        disbalanceZero: state.balancer.disbalanceZero,
        disbalanceLeft: state.balancer.disbalanceLeft,
        disbalanceRight: state.balancer.disbalanceRight,
        readingStarted: state.balancer.readingStarted,
        chartRequested: state.graph.chartRequested,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balancerConnect: () => dispatch(balancerConnect()),
        graphRequest: () => dispatch(graphRequest()),
        balancerDisconnect: () => dispatch(balancerDisconnect()),
        balancerRotationStart: (rotationStartStage: BalancerRotationStartState) => dispatch(balancerRotationStart(rotationStartStage)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);
