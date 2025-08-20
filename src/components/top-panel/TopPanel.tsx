import React from 'react';
import { connect } from "react-redux";
import { Button } from '../controls/button/Button';
import { balanceStart } from '../../state/ducks/balance/actions';
import { IApplicationState } from '../../state/ducks';
import { Vector } from './Vector';
import { graphRequest } from '../../state/ducks/graph/actions';

import "./style.css";

interface IProps {
    connected: boolean;
    mx: number;
    my: number;
    mz: number;
    balanceStart: () => void;
    graphRequest: () => void;
}

const TopPanel = ({ connected, mx, my, mz, balanceStart, graphRequest }: IProps) => {
    console.log(mx, my, mz);
    return (
        <div className="top-panel-container">
            <div className="top-panel">
                <Button
                    label="Update"
                    onClick={graphRequest}
                />
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
        graphRequest: () => dispatch(graphRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);
