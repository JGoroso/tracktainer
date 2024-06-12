import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EstadoPedidoGraph = ({ data }) => {
  const estados = data.reduce((acc, order) => {
    acc[order.estado] = (acc[order.estado] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(estados),
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      }
    },
    datasets: [
      {
        label: '# de Pedidos',
        data: Object.values(estados),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 190, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-xs mx-auto" >
      <Pie data={chartData} />
    </div >
  );
};

export default EstadoPedidoGraph;