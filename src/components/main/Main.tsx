import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import TopPanel from '../top-panel/TopPanel';
import { IApplicationState } from '../../state/ducks';
import { balanceUpdate } from '../../state/ducks/balance/actions';

import './style.css';

interface IProps {
    connected: boolean;
    balanceUpdate: () => void;
}

const Main = ({ balanceUpdate }: IProps) => {
    useEffect(() => {
        console.log("useEffect", "setInterval(() => balanceUpdate(), 1000)");
        const interval = setInterval(() => balanceUpdate(), 100);
        return () => clearInterval(interval);
    }, [balanceUpdate]);

    return (
        <div className="main">
            <TopPanel />
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
        balanceUpdate: () => dispatch(balanceUpdate()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
