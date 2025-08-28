import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../../state/ducks';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
import { Line } from 'react-chartjs-2';

import './style.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

type IProps = {
    x: number[];
    y: number[];
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Graph',
        },
    },
};
  
const labels =  Array.from({ length: 36 }, (value, index) => index * 10);

const data0 = {
    labels,
    datasets: [
    {
        label: 'Y',
        data: labels.map((value) => NaN),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    ],
};
  
const Graph = ({ x, y }: IProps) => {
    const [data, setData] = useState(data0 as any);

    useEffect(() => {
        const data = {
            labels: x,
            datasets: [{
                label: 'Y',
                data: y,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }],
        };

        setData(data);
    }, [x, y]);

    return (
        <div className="graph">
            <Line options={options} data={data} />;
        </div>
    );
};

const mapStateToProps = (state: IApplicationState) => {
    return {
        x: state.graph.x,
        y: state.graph.y,
    };
};

export default connect(mapStateToProps)(Graph);
