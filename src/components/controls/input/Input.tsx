import React from 'react';

import './style.scss';

type IProps = {
    onChange?: (text: string) => void;
    label?: string;
    enabled?: boolean;
};

export const Input = ({ onChange, label, enabled }: IProps) => {
    return (
        <input
            className={enabled === false ? "balance-input disabled" : "balance-input"}
            type='input'
            onInput={onChange ? (e: any) => onChange(e.target.value) : undefined}
        />
    );
};
