import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balanceStart } from '../../state/ducks/balance/actions';

import "./style.css";
import { IApplicationState } from '../../state/ducks';

interface IProps {
    connected: boolean;
    balanceStart: () => void;
}

const TopPanel = ({ connected, balanceStart }: IProps) => {
    return (
        <div className="top-panel-container">
            <div className="top-panel">
                <Button
                    label={connected ? "Disconnect" : "Connect"}
                    onClick={balanceStart}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state: IApplicationState) => {
    return {
        connected: state.balance.connected,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balanceStart: () => dispatch(balanceStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);
