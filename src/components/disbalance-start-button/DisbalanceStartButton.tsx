import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { BalancerRotationStartState, IBalanceStep, IDisbalance } from '../../balancer/Balancer';
import { Button } from '../controls/button/Button';
import { IApplicationState } from '../../state/ducks';
import { balancerRotationStart } from '../../state/ducks/balancer/actions';

import './style.css';

type IProps = {
    label?: string;
    rotationStartStage: BalancerRotationStartState;
    isIdle: boolean;
    balance: IBalanceStep;
    balancerRotationStart: (rotationStartStage: BalancerRotationStartState) => void;
};

const DisbalanceStartButton = ({ label, rotationStartStage, isIdle, balance, balancerRotationStart }: IProps) => {
    const onButtonClick = useCallback(() => balancerRotationStart(rotationStartStage)
        , [rotationStartStage, balancerRotationStart]
    );

    return (
        <div className="disbalance-button">
            <Button
                label={label ?? "Start " + rotationStartStage.toString()}
                onClick={onButtonClick}
                enabled={isIdle}
            />
            <div className="disbalance-button-param">
                <div className="disbalance-button-param-angle">{isNaN(balance.left.angle) ? "--" : balance.left.angle.toFixed(2)}</div>
                <div className="disbalance-button-param-weight">{}</div>
            </div>
            <div className="disbalance-button-param">
                <div className="disbalance-button-param-label">Value: </div>
                <div className="disbalance-button-param-value">{isNaN(balance.left.value) ? "--" : balance.left.value.toString()}</div>
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
