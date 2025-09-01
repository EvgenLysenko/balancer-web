import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TopPanel from '../top-panel/TopPanel';
import { IApplicationState } from '../../state/ducks';
import { balancerCheckUpdated } from '../../state/ducks/balancer/actions';
import Graph from '../graph/Graph';
import AngleWheel from '../angle-wheel/AngleWheel';

import './style.css';
//import { balancerParser } from '../../state/ducks/balancer/sagas';

interface IProps {
    angle: number;
    balancerCheckUpdated: () => void;
}

const Main = ({ angle, balancerCheckUpdated }: IProps) => {
    useEffect(() => {
        console.log("useEffect", "setInterval(() => balanceUpdate(), 1000)");
        const interval = setInterval(() => balancerCheckUpdated(), 100);
        return () => clearInterval(interval);
    }, [balancerCheckUpdated]);

    //balancerParser.test();

    return (
        <div className="main">
            <TopPanel />
            <div className="graphs-container">
                <AngleWheel
                    title=""
                    initialAngle={0}
                    currentValue={angle}
                />
                <Graph />
            </div>
        </div>
    );
};

const mapStateToProps = (state: IApplicationState) => {
    return {
        angle: state.balancer.angle,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balancerCheckUpdated: () => dispatch(balancerCheckUpdated()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
