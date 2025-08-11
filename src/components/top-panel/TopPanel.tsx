import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balanceStart } from '../../state/ducks/balance/actions';
import { IApplicationState } from '../../state/ducks';

import "./style.css";
import { Vector } from './Vector';

interface IProps {
    connected: boolean;
    mx: number;
    my: number;
    mz: number;
    balanceStart: () => void;
}

const TopPanel = ({ connected, mx, my, mz, balanceStart }: IProps) => {
    console.log(mx, my, mz);
    return (
        <div className="top-panel-container">
            <div className="top-panel">
                <div>
                    Vector: 
                    <Vector x={mx} y={my} z={mz}/>
                </div>
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
        mx: state.balance.mx,
        my: state.balance.my,
        mz: state.balance.mz,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        balanceStart: () => dispatch(balanceStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);
