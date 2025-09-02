import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { BalancerRotationStartState, IBalanceStep, IDisbalance } from '../../balancer/Balancer';
import { Button } from '../controls/button/Button';
import { IApplicationState } from '../../state/ducks';
import { balancerRotationStart } from '../../state/ducks/balancer/actions';

import './style.scss';

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

    const title = useMemo(() => {
        if (rotationStartStage === BalancerRotationStartState.Common)
            return "Zero Weight";
        else
            return rotationStartStage.toString();
    }, [rotationStartStage]);

    return (
        <div className="disbalance-button">
            <div className="disbalance-button-title">{label ?? title}</div>
            <Button
                label={"Start"}
                onClick={onButtonClick}
                enabled={isIdle}
            />
            <div className="disbalance-button-params-title">Disbalance (angle, W)</div>
            <div className="disbalance-button-params">
                <div className="disbalance-button-param">
                    <div className="disbalance-button-param-angle">{isNaN(balance.left.angle) ? "--" : balance.left.angle.toFixed(2)}</div>
                    <div className="disbalance-button-param-weight">{isNaN(balance.left.value) ? "--" : balance.left.value.toString()}</div>
                </div>
                <div className="disbalance-button-param">
                    <div className="disbalance-button-param-angle">{isNaN(balance.right.angle) ? "--" : balance.right.angle.toFixed(2)}</div>
                    <div className="disbalance-button-param-weight">{isNaN(balance.right.value) ? "--" : balance.right.value.toString()}</div>
                </div>
            </div>
            <div className="disbalance-button-params-title">Vector (X / Y)</div>
            <div className="disbalance-button-params">
                <div className="disbalance-button-param">
                    <div className="disbalance-button-param-vector">{isNaN(balance.lVector.x) ? "--" : balance.lVector.x}</div>
                    <div className="disbalance-button-param-vector">{isNaN(balance.lVector.y) ? "--" : balance.lVector.y}</div>
                </div>
                <div className="disbalance-button-param">
                    <div className="disbalance-button-param-vector">{isNaN(balance.rVector.x) ? "--" : balance.rVector.x}</div>
                    <div className="disbalance-button-param-vector">{isNaN(balance.rVector.y) ? "--" : balance.rVector.y}</div>
                </div>
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
