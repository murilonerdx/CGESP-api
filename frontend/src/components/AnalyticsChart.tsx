'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface AnalyticsChartProps {
    data: any[];
}

export const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
    // Process data for Chart.js
    const labels = data.map(d => d.date);
    const totalPoints = data.map(d => d.totalPoints);
    const intransitablePoints = data.map(d => d.intransitablePoints);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Pontos Totais',
                data: totalPoints,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
            },
            {
                label: 'Pontos Intransitáveis',
                data: intransitablePoints,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: { weight: 'bold' as any, size: 12 },
                    usePointStyle: true,
                    padding: 20
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { family: 'Inter', weight: 'bold' } as any },
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { family: 'Inter', weight: 'bold' } as any },
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-[2rem] border border-white/5"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tightest">Tendência de Alagamentos</h3>
                    <p className="text-sm font-bold text-white/40 tracking-tight">Histórico de pontos críticos detectados</p>
                </div>
            </div>
            <div className="h-[300px]">
                <Line data={chartData} options={options} />
            </div>
        </motion.div>
    );
};
