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
    chartLeft: number[];
    chartRight: number[];
};

const options = {
    responsive: true,
    indexAxis: 'y' as ('x' | 'y' | undefined), // !!! FIX ('x'|'y'|undefined) Types of property 'indexAxis' are incompatible. Type 'string' is not assignable to type '"y" | "x" | undefined'.
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            //text: 'Graph',
        },
    },
};
  
const labels =  Array.from({ length: 360 }, (value, index) => index);
//const data = labels.map((value) => Math.sin(value * 3.14 / 180) * 100);
const data = labels.map((value) => NaN);

const data0 = {
    labels,
    datasets: [
    {
        label: 'Left',
        data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
        label: 'Right',
        data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    ],
};
  
const Graph = ({ x, chartLeft, chartRight }: IProps) => {
    const [data, setData] = useState(data0 as any);

    useEffect(() => {
        const data = {
            labels: x,
            datasets: [{
                label: 'Left',
                data: chartLeft,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Right',
                data: chartRight,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }],
        };

        setData(data);
    }, [x, chartLeft, chartRight]);

    return (
        <div className="graph">
            <Line options={options} data={data} />
        </div>
    );
};

const mapStateToProps = (state: IApplicationState) => {
    return {
        x: state.graph.x,
        chartLeft: state.graph.chartLeft,
        chartRight: state.graph.chartRight,
    };
};

export default connect(mapStateToProps)(Graph);
