import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { BalancerRotationStartState, IDisbalance } from '../../balancer/Balancer';
import { Button } from '../controls/button/Button';
import { IApplicationState } from '../../state/ducks';
import { balancerRotationStart } from '../../state/ducks/balancer/actions';

import './style.css';

type IProps = {
    label?: string;
    rotationStartStage: BalancerRotationStartState;
    isIdle: boolean;
    disbalance: IDisbalance;
    balancerRotationStart: (rotationStartStage: BalancerRotationStartState) => void;
};

const DisbalanceStartButton = ({ label, rotationStartStage, isIdle, disbalance, balancerRotationStart }: IProps) => {
    const onButtonClick = useCallback(() => balancerRotationStart(rotationStartStage)
        , [rotationStartStage, balancerRotationStart]
    );

    return (
        <div className="disbalance-button">
            <Button
                label={label ?? "Start " + rotationStartStage.toString()}
                onClick={onButtonClick}
                enabled={true}
            />
            <div className="disbalance-button-param">
                <div className="disbalance-button-param-label">Disbalance:</div>
                <div className="disbalance-button-param-value">{isNaN(disbalance.angle) ? "--" : disbalance.angle.toFixed(2)}</div>
            </div>
            <div className="disbalance-button-param">
                <div className="disbalance-button-param-label">Value: </div>
                <div className="disbalance-button-param-value">{isNaN(disbalance.value) ? "--" : disbalance.value.toString()}</div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IApplicationState) => {
    return {
        connected: state.balancer.connected,
        isIdle: state.balancer.isIdle,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balancerRotationStart: (rotationStartStage: BalancerRotationStartState) => dispatch(balancerRotationStart(rotationStartStage)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisbalanceStartButton);
