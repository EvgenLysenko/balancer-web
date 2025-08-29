import React from 'react';

import './style.css';

type IProps = {
    onClick?: () => void;
    label?: string;
    enabled?: boolean;
};

export const Button = ({ onClick, label, enabled }: IProps) => {
    return (
        <div className={enabled === false ? "balance-button disabled" : "balance-button"}
             onClick={enabled === false ? undefined : onClick}
        >
            <div className="balance-button-label" >{label}</div>
        </div>
    );
};
