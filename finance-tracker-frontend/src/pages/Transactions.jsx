import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/api';

const CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Investment', 'Other'],
  EXPENSE: ['Food', 'Rent', 'Transport', 'Entertainment',
            'Healthcare', 'Shopping', 'Other']
};

const emptyForm = {
  title: '', description: '', amount: '',
  type: 'EXPENSE', category: 'Food',
  transactionDate: new Date().toISOString().split('T')[0]
};

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    try {
      const res = await transactionAPI.getAll();
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData({
        ...formData, type: value,
        category: CATEGORIES[value][0]
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transactionAPI.update(editingId, formData);
      } else {
        await transactionAPI.create(formData);
      }
      resetForm();
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      title: transaction.title,
      description: transaction.description || '',
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      transactionDate: transaction.transactionDate
    });
    setEditingId(transaction.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?'))
      return;
    try {
      await transactionAPI.delete(id);
      loadTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Filter transactions
  const filtered = transactions.filter(t => {
    if (filterType && t.type !== filterType) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    return true;
  });

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"/>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mt-4">

        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button type="button" className="btn-close"
                    onClick={() => setError('')}/>
          </div>
        )}

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Transactions</h4>
          <button
            className="btn btn-primary"
            style={{ background: '#1F4E79', border: 'none' }}
            onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? 'Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="card p-4 mb-4">
            <h6 className="fw-bold mb-3">
              {editingId ? 'Edit Transaction' : 'Add New Transaction'}
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Title *</label>
                  <input type="text" className="form-control"
                         name="title" value={formData.title}
                         onChange={handleChange}
                         placeholder="e.g. Biweekly deposit" required/>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Amount *</label>
                  <input type="number" className="form-control"
                         name="amount" value={formData.amount}
                         onChange={handleChange}
                         placeholder="0.00" step="0.01"
                         min="0.01" required/>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Type *</label>
                  <select className="form-select" name="type"
                          value={formData.type} onChange={handleChange}>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Category *</label>
                  <select className="form-select" name="category"
                          value={formData.category} onChange={handleChange}>
                    {CATEGORIES[formData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Date *</label>
                  <input type="date" className="form-control"
                         name="transactionDate"
                         value={formData.transactionDate}
                         onChange={handleChange} required/>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">
                    Description (optional)
                  </label>
                  <textarea className="form-control" name="description"
                            value={formData.description}
                            onChange={handleChange} rows="2"
                            placeholder="Add a note..."/>
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary"
                          style={{ background: '#1F4E79', border: 'none' }}>
                    {editingId ? 'Update Transaction' : 'Save Transaction'}
                  </button>
                  <button type="button" className="btn btn-secondary"
                          onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="card p-3 mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Type</label>
              <select className="form-select" value={filterType}
                      onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Category</label>
              <select className="form-select" value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {[...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE]
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
              </select>
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setFilterType('');
                        setFilterCategory('');
                      }}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card p-3">
          <h6 className="fw-bold mb-3">
            All Transactions
            <span className="badge bg-secondary ms-2">
              {filtered.length}
            </span>
          </h6>
          {filtered.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div className="fw-bold">{t.title}</div>
                        {t.description && (
                          <small className="text-muted">
                            {t.description}
                          </small>
                        )}
                      </td>
                      <td>
                        <span>
                          {t.type}
                        </span>
                      </td>
                      <td>
                        <span>
                          {t.category}
                        </span>
                      </td>
                      <td>
                        {new Date(t.transactionDate)
                          .toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`fw-bold ${
                          t.type === 'INCOME'
                            ? 'text-success' : 'text-danger'}`}>
                          {t.type === 'INCOME' ? '+' : '-'}
                          ${parseFloat(t.amount).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(t)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(t.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No transactions found</p>
              <button
                className="btn btn-primary"
                style={{ background: '#1F4E79', border: 'none' }}
                onClick={() => setShowForm(true)}>
                Add your first transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Transactions;