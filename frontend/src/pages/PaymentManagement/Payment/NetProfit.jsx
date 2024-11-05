import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../../components/Spinner';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Header from '../../../components/headerfooter/Header';
import Footer from '../../../components/headerfooter/Footer';
import logo from '../../../images/logo.png';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const NetProfit = () => {
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/payments')
      .then((response) => {
        setPayments(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/expenses')
      .then((response) => {
        setExpenses(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set up document title and header
    doc.setFontSize(24);
    doc.setFont('Poppins', 'bold');
    doc.text('CraftMart', 14, 22);

    // Add the logo image
    const logoWidth = 45; // Adjust width as needed
    const logoHeight = 30; // Adjust height as needed
    doc.addImage(logo, 'PNG', 160, 10, logoWidth, logoHeight); // Add logo to the right side

    doc.setFontSize(18);
    doc.text('Income Status Statement', 14, 32);

    // Add report date
    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont('Poppins', 'normal');
    doc.text(`Date: ${reportDate}`, 14, 42);

    // Draw a line under the header
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(10, 45, 205, 45);

    // Define the table for payments
    const paymentColumns = ["Payment ID", "Customer Name", "Total Price"];
    const paymentRows = payments.map(payment => [
      payment._id,
      payment.cardHolderName,
      `Rs ${payment.totalPrice.toFixed(2)}`,
    ]);

    // Add payments table
    doc.autoTable(paymentColumns, paymentRows, {
      startY: 50,
      theme: 'grid',
      headStyles: {
        fillColor: '#330D0F',
        textColor: '#FFFFFF',
        font: 'Poppins',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        font: 'Poppins',
        fontSize: 10,
        valign: 'top',
        overflow: 'linebreak',
        cellPadding: 2,
        cellWidth: 'wrap',
      },
      margin: { left: 10, right: 14 },
      columnStyles: {
        0: { cellWidth: 60, halign: 'left' },
        1: { cellWidth: 70, halign: 'left' },
        2: { cellWidth: 60, halign: 'right' },
      },
    });

    // Add total income after payments table
    doc.text(`Total Income: Rs ${totalIncome.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

    // Define the table for expenses
    const expenseColumns = ["Expense ID", "Name", "Cost"];
    const expenseRows = expenses.map(expense => [
      expense._id,
      expense.name,
      `Rs ${expense.cost.toFixed(2)}`,
    ]);

    // Add expenses table
    doc.autoTable(expenseColumns, expenseRows, {
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid',
      headStyles: {
        fillColor: '#330D0F',
        textColor: '#FFFFFF',
        font: 'Poppins',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        font: 'Poppins',
        fontSize: 10,
        valign: 'top',
        overflow: 'linebreak',
        cellPadding: 2,
        cellWidth: 'wrap',
      },
      margin: { left: 10, right: 14 },
      columnStyles: {
        0: { cellWidth: 60, halign: 'left' },
        1: { cellWidth: 70, halign: 'left' },
        2: { cellWidth: 60, halign: 'left' },
      },
    });

    // Add total expenses after expenses table
    doc.text(`Total Expenses: Rs ${totalExpenses.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

    // Calculate net profit
    const netProfit = totalIncome - totalExpenses;

    // Define net income table
    const netIncomeColumns = ["Description", "Amount", "Amount"];
    const netIncomeRows = [];

    // Total Income Row
    netIncomeRows.push(["Total Income", "", `Rs ${totalIncome.toFixed(2)}`]);

    // Expenses Rows
    expenses.forEach(expense => {
      netIncomeRows.push([expense.name, `Rs ${expense.cost.toFixed(2)}`, ""]);
    });

    // Total Expenses Row
    netIncomeRows.push(["Total Expenses", "", `Rs ${totalExpenses.toFixed(2)}`]);

    // Net Profit Row
    netIncomeRows.push(["Net Profit", "", `Rs ${netProfit.toFixed(2)}`]);

    // Add the Net Income Table to the PDF
    doc.autoTable(netIncomeColumns, netIncomeRows, {
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid',
      headStyles: {
        fillColor: '#330D0F',
        textColor: '#FFFFFF',
        font: 'Poppins',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        font: 'Poppins',
        fontSize: 10,
        valign: 'top',
        overflow: 'linebreak',
        cellPadding: 2,
        cellWidth: 'wrap',
      },
      margin: { left: 10, right: 14 },
      columnStyles: {
        0: { cellWidth: 90, halign: 'left' },
        1: { cellWidth: 50, halign: 'right' },
        2: { cellWidth: 50, halign: 'right' },
      },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Craftmart', 14, doc.internal.pageSize.height - 10);
      },
    });

    doc.text(`Total Net Profit: Rs ${netProfit.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

    // Save the PDF
    doc.save('income-status-statement.pdf');
  };


  const totalIncome = payments.reduce((total, payment) => total + payment.totalPrice, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.cost, 0);
  const netProfit = totalIncome - totalExpenses;




  const createChart = (chartType = 'bar') => {
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
    }
    const newChartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          label: 'Amount (Rs)',
          data: [totalIncome, totalExpenses],
          backgroundColor: ['#4CAF50', '#FF6347'],
          barThickness: 150, // You can adjust this value to change the width of the bars
        }],
      },
      options: {
        maintainAspectRatio: false,           //can remove
        scales: { 
          y: { 
            beginAtZero: true,
            grid: {
              lineWidth: 3, // Set the thickness of the y-axis grid lines
            },
            ticks: {
              color: '#000', // Change tick color if needed
              font: {
                size: 12, // Adjust tick font size
              }
            }
          },
          x: {
            grid: {
              lineWidth: 3, // Set the thickness of the x-axis grid lines
            },
            ticks: {
              color: '#000', // Change tick color if needed
              font: {
                size: 12, // Adjust tick font size
              }
            }
          },
        },
        plugins: { legend: { display: true } },
      },
    });
    setChartInstance(newChartInstance);
  };

  useEffect(() => {
    if (!loading && payments.length > 0 && expenses.length > 0) {
      createChart();
    }
  }, [loading, payments, expenses]);




  
export default NetProfit;
