import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8083/api/admin/transactions?page=${page}&size=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setTransactions(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    const updateTransactionStatus = async (transactionId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:8083/api/admin/transactions/${transactionId}/status?status=${status}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh transactions list
            fetchTransactions();
        } catch (error) {
            console.error('Error updating transaction status:', error);
            alert('Error updating transaction status');
        }
    };

    if (loading) {
        return <div className="text-center">Loading transactions...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Transaction Management</h4>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Buyer</th>
                                <th>Seller</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>#{transaction.id}</td>
                                    <td>{transaction.buyer ? `${transaction.buyer.firstName} ${transaction.buyer.lastName}` : 'N/A'}</td>
                                    <td>{transaction.seller ? `${transaction.seller.firstName} ${transaction.seller.lastName}` : 'N/A'}</td>
                                    <td>{transaction.listing?.title}</td>
                                    <td>{transaction.quantity} {transaction.listing?.unit}</td>
                                    <td>RWF {transaction.totalAmount?.toLocaleString()}</td>
                                    <td>
                      <span className={`badge ${
                          transaction.status === 'COMPLETED' ? 'bg-success' :
                              transaction.status === 'PENDING' ? 'bg-warning' :
                                  transaction.status === 'CANCELLED' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {transaction.status}
                      </span>
                                    </td>
                                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <select
                                                className="form-select form-select-sm"
                                                value={transaction.status}
                                                onChange={(e) => updateTransactionStatus(transaction.id, e.target.value)}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                                <option value="REFUNDED">Refunded</option>
                                            </select>
                                            <button className="btn btn-primary" title="View Details">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {transactions.length === 0 && (
                        <div className="text-center py-4">
                            <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No transactions found.</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page - 1)}>
                                        Previous
                                    </button>
                                </li>

                                {[...Array(totalPages).keys()].map(pageNumber => (
                                    <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(pageNumber)}>
                                            {pageNumber + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionManagement;