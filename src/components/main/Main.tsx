import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TopPanel from '../top-panel/TopPanel';
import { IApplicationState } from '../../state/ducks';
import { balanceCheckUpdated } from '../../state/ducks/balance/actions';
import Graph from '../graph/Graph';
import AngleWheel from '../angle-wheel/AngleWheel';

import './style.css';

interface IProps {
    connected: boolean;
    balanceCheckUpdated: () => void;
}

const Main = ({ balanceCheckUpdated }: IProps) => {
    useEffect(() => {
        console.log("useEffect", "setInterval(() => balanceUpdate(), 1000)");
        const interval = setInterval(() => balanceCheckUpdated(), 100);
        return () => clearInterval(interval);
    }, [balanceCheckUpdated]);

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
        connected: state.balance.connected,
        serialReader: state.balance.serialReader,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balanceCheckUpdated: () => dispatch(balanceCheckUpdated()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
