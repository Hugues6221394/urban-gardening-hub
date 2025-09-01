// src/components/transactions/Checkout.js
import React, { useState, useEffect } from 'react'; // Added useEffect import
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        quantity: 1,
        paymentMethod: 'MOBILE_MONEY'
    });
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`http://localhost:8083/api/marketplace/${id}`);
                setListing(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching listing:', error);
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8083/api/transactions?listingId=${id}&quantity=${formData.quantity}&paymentMethod=${formData.paymentMethod}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Purchase completed successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error completing purchase:', error);
            alert('Error completing purchase. Please try again.');
        }

        setSubmitting(false);
    };

    if (loading) {
        return <div className="text-center">Loading checkout...</div>;
    }

    if (!listing) {
        return <div className="alert alert-danger">Listing not found.</div>;
    }

    const totalPrice = listing.pricePerUnit * formData.quantity;

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4>Checkout</h4>
                    </div>
                    <div className="card-body">
                        <div className="mb-4">
                            <h5>{listing.title}</h5>
                            <p className="text-muted">{listing.description}</p>
                            <div className="d-flex justify-content-between">
                                <span>Price: RWF {listing.pricePerUnit?.toLocaleString()}/{listing.unit}</span>
                                <span>Available: {listing.quantity} {listing.unit}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity ({listing.unit})</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    min="0.1"
                                    max={listing.quantity}
                                    step="0.1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                                <select
                                    className="form-select"
                                    id="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                >
                                    <option value="MOBILE_MONEY">Mobile Money</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="CASH">Cash on Delivery</option>
                                </select>
                            </div>

                            <div className="card mb-3">
                                <div className="card-body">
                                    <h6>Order Summary</h6>
                                    <div className="d-flex justify-content-between">
                                        <span>Subtotal:</span>
                                        <span>RWF {totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Platform Fee (5%):</span>
                                        <span>RWF {(totalPrice * 0.05).toLocaleString()}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total:</span>
                                        <span>RWF {(totalPrice * 1.05).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Processing...' : 'Complete Purchase'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;