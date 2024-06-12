import React from 'react';

const ReportePedidos = ({ title, data }) => {
  const getColorClass = (estado) => {
    switch (estado) {
      case 'cancelado':
        return 'text-red-600';
      case 'completado':
        return 'text-blue-600';
      case 'pendiente':
        return 'text-yellow-400';
      case 'entregado':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  console.log(data);
  return (
    <div className=" shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-4">
        {data && data.map(order => (
          <li key={order.id} className="p-4 border rounded-lg">
            <p className="text-lg font-medium">Cliente: <span className="font-normal">{order.cliente}</span></p>
            <p className="text-lg font-medium">Fecha: <span className="font-normal">{order.fechaPedido}</span></p>
            <p className="text-lg font-medium">Estado: <span className={`font-normal ${getColorClass(order.estado)}`}>{order.estado}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportePedidos;