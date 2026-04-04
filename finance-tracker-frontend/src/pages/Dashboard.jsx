import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/api';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
);

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardRes, transactionsRes] = await Promise.all([
        transactionAPI.getDashboard(),
        transactionAPI.getAll()
      ]);
      setSummary(dashboardRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate category totals for expenses
  const getExpenseByCategory = () => {
    const categories = {};
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) +
          parseFloat(t.amount);
      });
    return categories;
  };

  const expenseCategories = getExpenseByCategory();

  const doughnutData = {
    labels: Object.keys(expenseCategories),
    datasets: [{
      data: Object.values(expenseCategories),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56',
        '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
      ],
      borderWidth: 2,
    }]
  };

  // Monthly income vs expense bar chart
  const getMonthlyData = () => {
    const months = {};
    transactions.forEach(t => {
      const month = new Date(t.transactionDate)
        .toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!months[month]) months[month] = { income: 0, expense: 0 };
      if (t.type === 'INCOME') months[month].income += parseFloat(t.amount);
      else months[month].expense += parseFloat(t.amount);
    });
    return months;
  };

  const monthlyData = getMonthlyData();
  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map(m => m.income),
        backgroundColor: '#43e97b',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyData).map(m => m.expense),
        backgroundColor: '#f5576c',
        borderRadius: 6,
      }
    ]
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mt-4">

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card p-3 d-flex flex-row align-items-center gap-3">
              <div>
                <p style={{ fontSize: '15px', color: 'black', margin: '0 0 4px' }}>
                  Total Balance
                </p>
                <p style={{
                  fontSize: '22px', fontWeight: '600',
                  color: 'black', margin: 0
                }}>
                  ${parseFloat(summary?.balance || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 d-flex flex-row align-items-center gap-3">
              <div>
                <p style={{ fontSize: '15px', color: 'black', margin: '0 0 4px' }}>
                  Total Income
                </p>
                <p style={{
                  fontSize: '22px', fontWeight: '600',
                  color: 'black', margin: 0
                }}>
                  ${parseFloat(summary?.totalIncome || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 d-flex flex-row align-items-center gap-3">
              <div>
                <p style={{ fontSize: '15px', color: 'black', margin: '0 0 4px' }}>
                  Total Expenses
                </p>
                <p style={{
                  fontSize: '22px', fontWeight: '600',
                  color: 'black', margin: 0
                }}>
                  ${parseFloat(summary?.totalExpenses || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-3 mb-4">
          <div className="col-md-5">
            <div className="card p-3">
              <h6 className="fw-bold mb-3">Expenses by Category</h6>
              {Object.keys(expenseCategories).length > 0 ? (
                <Doughnut data={doughnutData}
                  options={{ plugins: { legend: { position: 'bottom' } } }} />
              ) : (
                <p className="text-muted text-center py-4">
                  No expense data yet
                </p>
              )}
            </div>
          </div>
          <div className="col-md-7">
            <div className="card p-3">
              <h6 className="fw-bold mb-3">Income vs Expenses</h6>
              {Object.keys(monthlyData).length > 0 ? (
                <Bar data={barData}
                  options={{
                    responsive: true, plugins: {
                      legend: { position: 'top' }
                    }
                  }} />
              ) : (
                <p className="text-muted text-center py-4">
                  No data yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Recent Transactions</h6>
            <Link to="/transactions">
              View All
            </Link>
          </div>
          {summary?.recentTransactions?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentTransactions.map(t => (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td>
                        <span>
                          {t.category}
                        </span>
                      </td>
                      <td>{new Date(t.transactionDate)
                        .toLocaleDateString()}</td>
                      <td>
                        <span className={`fw-bold ${t.type === 'INCOME'
                          ? 'text-success' : 'text-danger'}`}>
                          {t.type === 'INCOME' ? '+' : '-'}
                          ${parseFloat(t.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center py-3">
              No transactions yet.{' '}
              <Link to="/transactions">Add your first one!</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;