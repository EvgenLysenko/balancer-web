import React from 'react';

interface IProps {
    x: number;
    y: number;
    z: number;
}

export const Vector = ({ x, y, z }: IProps) => {
    return (
        <div className="vector">
            <div>{x}</div>
            <div>{y}</div>
            <div>{z}</div>
        </div>
    );
}
