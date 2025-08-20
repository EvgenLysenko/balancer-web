import React from 'react';

import './style.css';

type IProps = {
    onClick?: () => void;
    label?: string;
};

export const Button = ({ onClick, label }: IProps) => {
    return (
        <div className="balance-button"
             onClick={onClick}
        >
            <div className="balance-button-label" >{label}</div>
        </div>
    );
};
