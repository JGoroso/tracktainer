'use client'
import React, { useState } from 'react';
// import { fetchOrdersByMonth, fetchCancelledOrdersByMonth, fetchCompletedOrdersByMonth } 
import { fetchOrders, fetchOrdersByDateRange, fetchOrdersByMonth, fetchOrdersCancelled } from '../firebase/firestore/firestore';
import ReportePedidos from '../components/ReportePedidos';
import EstadoPedidoGraph from '../components/EstadoPedidoGraph';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

const ReportsPage = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-31');
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [completedOrdersByMonth, setCompletedOrdersByMonth] = useState([]);

  const handleStartDateChange = e => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = e => {
    setEndDate(e.target.value);
  };

  const handleFetchOrders = async (estado) => {
    const orders = await fetchOrders(startDate, endDate, estado);
    setOrdersByMonth(orders)
    // const completedOrders = await fetchCompletedOrdersByMonth(startDate, endDate);
    // setCompletedOrdersByMonth(completedOrders);
  };


  const exportToPDF = async () => {
    const input = document.getElementById('report-content');
    const canvas = await html2canvas(input, {
      scale: 2, // Aumenta la escala para mejorar la calidad
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;

    let pdfX = 0;
    let pdfY = 0;
    let pdfImgHeight = pdfHeight;
    let pdfImgWidth = pdfHeight * ratio;

    if (pdfImgWidth > pdfWidth) {
      pdfImgWidth = pdfWidth;
      pdfImgHeight = pdfWidth / ratio;
    }

    pdf.addImage(imgData, 'PNG', pdfX, pdfY, pdfImgWidth, pdfImgHeight);
    pdf.save(`reporte_pedidos_${startDate}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="sm:flex sm:items-center sm:justify-between p-2">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="font-medium text-xl text-gray-800">Reportes</h2>
          </div>
          <p className="mt-1 text-sm text-gray-800">En esta sección podra exportar y visualizar sus pedidos hechos en un periodo dado</p>
        </div>
        <div className="flex items-center mt-4 gap-x-3">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-full px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Volver al mapa</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <label className="block text-lg font-medium mb-2">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="block w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="block w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
          <button
            onClick={() => handleFetchOrders('')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md mb-2 md:mb-0"
          >
            Pedidos
          </button>
          <button
            onClick={() => handleFetchOrders('cancelado')}
            className="px-4 py-2 bg-red-600 text-white rounded-md mb-2 md:mb-0"
          >
            Pedidos cancelados
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Exportar a PDF
          </button>
        </div>
      </div>
      <div id="report-content" className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 p-2">
          <ReportePedidos title="Pedidos del mes" data={ordersByMonth} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <EstadoPedidoGraph data={ordersByMonth} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;