import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TopPanel from '../top-panel/TopPanel';

import './style.css';

export const Main = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        //dispatch(fetchAppParams());
    }, [dispatch]);

    return (
        <div className="main">
            <TopPanel />
        </div>
    );
};
