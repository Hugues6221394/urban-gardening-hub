import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GreenPartnerApplication = () => {
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        checkEligibility();
    }, []);

    const checkEligibility = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8083/api/certification/eligibility', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setEligibility(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error checking eligibility:', error);
            setLoading(false);
        }
    };

    const applyForCertification = async () => {
        setApplying(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8083/api/certification/apply', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Application submitted successfully! It will be reviewed within 3-5 business days.');
            checkEligibility(); // Refresh eligibility
        } catch (error) {
            console.error('Error applying for certification:', error);
            alert('Error applying for certification. Please try again.');
        }
        setApplying(false);
    };

    if (loading) {
        return <div className="text-center">Checking eligibility...</div>;
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header bg-success text-white">
                        <h4>Green City Partner Certification</h4>
                    </div>
                    <div className="card-body">
                        <div className="text-center mb-4">
                            <i className="fas fa-certificate fa-4x text-success mb-3"></i>
                            <h3>Become a Certified Green City Partner</h3>
                            <p className="text-muted">
                                Join our network of sustainable businesses committed to supporting urban farming
                                and local food systems in Rwanda.
                            </p>
                        </div>

                        {eligibility?.eligible ? (
                            <div className="alert alert-success">
                                <h5>You are eligible for certification!</h5>
                                <p>
                                    You have made {eligibility.localPurchases} local purchases from urban farmers
                                    on our platform. Businesses need at least 10 local purchases to qualify for
                                    Green City Partner certification.
                                </p>

                                {eligibility.currentStatus === 'NOT_CERTIFIED' && (
                                    <div className="d-grid">
                                        <button
                                            className="btn btn-success btn-lg"
                                            onClick={applyForCertification}
                                            disabled={applying}
                                        >
                                            {applying ? 'Submitting...' : 'Apply for Certification'}
                                        </button>
                                    </div>
                                )}

                                {eligibility.currentStatus === 'PENDING' && (
                                    <div className="alert alert-info">
                                        <i className="fas fa-clock me-2"></i>
                                        Your application is under review. Please check back in 3-5 business days.
                                    </div>
                                )}

                                {eligibility.currentStatus === 'CERTIFIED' && (
                                    <div className="alert alert-success">
                                        <i className="fas fa-check-circle me-2"></i>
                                        Congratulations! You are a certified Green City Partner.
                                        {eligibility.certificationDate && (
                                            <p className="mb-0">Certified on: {new Date(eligibility.certificationDate).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="alert alert-warning">
                                <h5>Not yet eligible</h5>
                                <p>
                                    You have made {eligibility?.localPurchases || 0} local purchases from urban farmers.
                                    Businesses need at least 10 local purchases to qualify for Green City Partner certification.
                                </p>
                                <p>Continue supporting local urban farmers to become eligible!</p>
                                <div className="d-grid">
                                    <button className="btn btn-outline-success" onClick={() => window.location.href = '/marketplace'}>
                                        Browse Local Produce
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <h5>Benefits of Certification</h5>
                            <ul>
                                <li>Green City Partner badge on your profile and listings</li>
                                <li>Featured placement in our business directory</li>
                                <li>Marketing support and promotion</li>
                                <li>Eligibility for government incentives and tax benefits</li>
                                <li>Priority access to new produce and farmers</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GreenPartnerApplication;