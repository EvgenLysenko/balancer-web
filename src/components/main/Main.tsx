import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TopPanel from '../top-panel/TopPanel';
import { IApplicationState } from '../../state/ducks';
import { balanceCheckUpdated } from '../../state/ducks/balance/actions';
import Graph from '../graph/Graph';
//import { BalancerParser } from '../../balancer/BalancerParser';

import './style.css';

interface IProps {
    connected: boolean;
    chartRequested: boolean;
    balanceCheckUpdated: () => void;
}

const Main = ({ balanceCheckUpdated }: IProps) => {
    useEffect(() => {
        console.log("useEffect", "setInterval(() => balanceUpdate(), 1000)");
        const interval = setInterval(() => balanceCheckUpdated(), 1000);
        return () => clearInterval(interval);
    }, [balanceCheckUpdated]);

    //const parser = new BalancerParser();
    //parser.test();

    return (
        <div className="main">
            <TopPanel />
            <Graph />
        </div>
    );
};

const mapStateToProps = (state: IApplicationState) => {
    return {
        connected: state.balance.connected,
        serialReader: state.balance.serialReader,
        chartRequested: state.graph.chartRequested,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balanceCheckUpdated: () => dispatch(balanceCheckUpdated()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
