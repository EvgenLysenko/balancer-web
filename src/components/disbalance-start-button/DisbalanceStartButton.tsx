import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { BalancerRotationStartState, IBalanceStep, IDisbalance } from '../../balancer/Balancer';
import { Button } from '../controls/button/Button';
import { IApplicationState } from '../../state/ducks';
import { balancerRotationStart } from '../../state/ducks/balancer/actions';
import { Input } from '../controls/input/Input';

import './style.scss';

type IProps = {
    label?: string;
    rotationStartStage: BalancerRotationStartState;
    isIdle: boolean;
    balance: IBalanceStep;
    balancerRotationStart: (rotationStartStage: BalancerRotationStartState, lAngle: number, lWeight: number, rAngle: number, rWeight: number) => void;
};

const toDeg = (rad: number): number => {
    return 180 / Math.PI * rad;
} 

const DisbalanceStartButton = ({ label, rotationStartStage, isIdle, balance, balancerRotationStart }: IProps) => {
    const [lAngle, setLeftAngle] = useState(0);
    const [lWeight, setLeftWeight] = useState(0);
    const [rAngle, setRightAngle] = useState(0);
    const [rWeight, setRightWeight] = useState(0);

    const leftDisbalanceAngle = useMemo(() => toDeg(Math.atan2(balance.lVector.y, balance.lVector.x)), [balance]);
    const leftDisbalanceWeight = useMemo(() => Math.sqrt(balance.lVector.y * balance.lVector.y + balance.lVector.x * balance.lVector.x), [balance]);
    const rightDisbalanceAngle = useMemo(() => toDeg(Math.atan2(balance.rVector.y, balance.rVector.x)), [balance]);
    const rightDisbalanceWeight = useMemo(() => Math.sqrt(balance.rVector.y * balance.rVector.y + balance.rVector.x * balance.rVector.x), [balance]);

    const onButtonClick = useCallback(() => balancerRotationStart(rotationStartStage, lAngle, lWeight, rAngle, rWeight)
        , [rotationStartStage, balancerRotationStart, lAngle, lWeight, rAngle, rWeight]
    );

    const title = useMemo(() => {
        if (rotationStartStage === BalancerRotationStartState.Common)
            return "Zero Weight";
        else
            return rotationStartStage.toString();
    }, [rotationStartStage]);

    const onAngleChanged = useCallback((value: string) => {
        const angle = Number.parseFloat(value);
        setLeftAngle(Number.parseFloat(value));
        console.log(angle);
    }, [setLeftAngle]);

    const onWeightChanged = useCallback((value: string) => {
        const weight = Number.parseFloat(value);
        setLeftWeight(Number.parseFloat(value));
        console.log(weight);
    }, [setLeftWeight]);

    const onRightAngleChanged = useCallback((value: string) => {
        const angle = Number.parseFloat(value);
        setRightAngle(Number.parseFloat(value));
        console.log(angle);
    }, [setRightAngle]);

    const onRightWeightChanged = useCallback((value: string) => {
        const weight = Number.parseFloat(value);
        setRightWeight(Number.parseFloat(value));
        console.log(weight);
    }, [setRightWeight]);

    return (
        <div className="disbalance-button">
            <div className="disbalance-button-title">{label ?? title}</div>
            <Button
                label={"Start"}
                onClick={onButtonClick}
                enabled={isIdle}
            />
            <div className="disbalance-button-params-title">Weights (angle, W)</div>
            <div className="disbalance-button-params">
                <div className="disbalance-button-param">
                    <Input label="Left angle" onChange={onAngleChanged} />
                    <Input onChange={onWeightChanged} />
                </div>
                <div className="disbalance-button-param">
                    <Input onChange={onRightAngleChanged} />
                    <Input onChange={onRightWeightChanged} />
                </div>
            </div>
            <div className="disbalance-button-params-title">Disbalance (angle, W)</div>
            <div className="disbalance-button-params">
                <div className="disbalance-button-param">
                    <div className="disbalance-button-param-angle">{isNaN(leftDisbalanceAngle) ? "--" : leftDisbalanceAngle.toFixed(1)}</div>
                    <div className="disbalance-button-param-weight">{isNaN(leftDisbalanceWeight) ? "--" : leftDisbalanceWeight.toFixed(3)}</div>
                </div>
                <div className="disbalance-button-param">
                    <div className="disbalance-button-param-angle">{isNaN(rightDisbalanceAngle) ? "--" : rightDisbalanceAngle.toFixed(1)}</div>
                    <div className="disbalance-button-param-weight">{isNaN(rightDisbalanceWeight) ? "--" : rightDisbalanceWeight.toFixed(3)}</div>
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
        balancerRotationStart: (rotationStartStage: BalancerRotationStartState, lAngle: number, lWeight: number, rAngle: number, rWeight: number) => dispatch(balancerRotationStart(rotationStartStage, lAngle, lWeight, rAngle, rWeight)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisbalanceStartButton);
