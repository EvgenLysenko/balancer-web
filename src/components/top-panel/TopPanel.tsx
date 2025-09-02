import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balancerConnect, balancerDisconnect, balancerRotationStart } from '../../state/ducks/balancer/actions';
import { IApplicationState } from '../../state/ducks';
import { graphRequest } from '../../state/ducks/graph/actions';
import { BalancerRotationStartState, IBalanceStep } from '../../balancer/Balancer';
import DisbalanceStartButton from '../disbalance-start-button/DisbalanceStartButton';

import "./style.scss";

interface IProps {
    connected: boolean;
    readingStarted: boolean;
    chartRequested: boolean;
    isIdle: boolean;
    rpm: number;
    angle: number;
    step0: IBalanceStep;
    step1: IBalanceStep;
    step2: IBalanceStep;
    stepCalibration: IBalanceStep;
    stepCurrent: IBalanceStep;
    balancerConnect: () => void;
    graphRequest: () => void;
    balancerDisconnect: () => void;
    balancerRotationStart: (rotationStartStage: BalancerRotationStartState) => void;
}

const TopPanel = ({ connected, readingStarted, chartRequested, isIdle, rpm, angle, step0, step1, step2, stepCalibration, stepCurrent,
    balancerConnect, balancerDisconnect, graphRequest, balancerRotationStart
}: IProps) => {
    return (
        <div className="top-panel-container">
            <div className="top-panel">
                <div className="drive-state-container">
                    <div className="drive-state">
                        <div className="drive-state-param">
                            <div className="drive-state-param-title">Angle:</div>
                            <div className="drive-state-param-value">{isNaN(angle) ? "--" : angle.toString()}</div>
                        </div>
                        <div className="drive-state-param">
                            <div className="drive-state-param-title">RPM:</div>
                            <div className="drive-state-param-value">{isNaN(rpm) ? "--" : rpm.toString()}</div>
                        </div>
                    </div>
                </div>
                <DisbalanceStartButton
                    label="Zero Weight"
                    balance={step0}
                    rotationStartStage={BalancerRotationStartState.Zero}
                />
                <DisbalanceStartButton
                    label="Left"
                    balance={step1}
                    rotationStartStage={BalancerRotationStartState.Left}
                />
                <DisbalanceStartButton
                    label="Right"
                    balance={step2}
                    rotationStartStage={BalancerRotationStartState.Right}
                />
                <DisbalanceStartButton
                    label="Calculate"
                    balance={stepCalibration}
                    rotationStartStage={BalancerRotationStartState.Common}
                />
                <DisbalanceStartButton
                    label="Current"
                    balance={stepCurrent}
                    rotationStartStage={BalancerRotationStartState.Common}
                />
                <div className="top-panel-right-buttons">
                    <div className="top-panel-connect-button-container">
                        <Button
                            label={connected ? "Disconnect" : "Connect"}
                            onClick={connected ? balancerDisconnect : balancerConnect}
                        />
                    </div>
                    <Button
                        label={readingStarted ? "Reading started" : "Reading NO"}
                    />
                    <Button
                        label={chartRequested ? "Chart Requested" : "Request Chart"}
                        onClick={chartRequested ? graphRequest : graphRequest }
                    />
                </div>
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
        step0: state.balancer.step0,
        step1: state.balancer.step1,
        step2: state.balancer.step2,
        stepCalibration: state.balancer.stepCalibration,
        stepCurrent: state.balancer.stepCurrent,
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
