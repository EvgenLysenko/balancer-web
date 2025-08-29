import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TopPanel from '../top-panel/TopPanel';
import { IApplicationState } from '../../state/ducks';
import { balancerCheckUpdated } from '../../state/ducks/balancer/actions';
import Graph from '../graph/Graph';
import AngleWheel from '../angle-wheel/AngleWheel';

import './style.css';

interface IProps {
    connected: boolean;
    balancerCheckUpdated: () => void;
}

const Main = ({ balancerCheckUpdated }: IProps) => {
    useEffect(() => {
        console.log("useEffect", "setInterval(() => balanceUpdate(), 1000)");
        const interval = setInterval(() => balancerCheckUpdated(), 100);
        return () => clearInterval(interval);
    }, [balancerCheckUpdated]);

    return (
        <div className="main">
            <TopPanel />
            <div className="graphs-container">
                <AngleWheel />
                <Graph />
            </div>
        </div>
    );
};

const mapStateToProps = (state: IApplicationState) => {
    return {
        connected: state.balancer.connected,
        serialReader: state.balancer.serialReader,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balancerCheckUpdated: () => dispatch(balancerCheckUpdated()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
