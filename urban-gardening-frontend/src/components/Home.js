// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <div className="jumbotron bg-light p-5 rounded">
                <h1 className="display-4">Transform Urban Spaces into Thriving Gardens</h1>
                <p className="lead">
                    Our AI-Powered Urban Kitchen Gardening Hub connects landowners with urban farmers to transform
                    underutilized spaces into productive micro-farms.
                </p>
                <hr className="my-4" />
                <p>
                    Join Rwanda's Green City Mission and contribute to food security, economic empowerment,
                    and environmental sustainability.
                </p>
                <div className="d-flex gap-2">
                    <Link className="btn btn-success btn-lg" to="/spaces" role="button">
                        Explore Available Spaces
                    </Link>
                    <Link className="btn btn-outline-success btn-lg" to="/signup" role="button">
                        Join Our Community
                    </Link>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">For Landowners</h5>
                            <p className="card-text">
                                Monetize your unused spaces while contributing to urban greening and food security.
                                Receive tax incentives and earn passive income.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">For Urban Farmers</h5>
                            <p className="card-text">
                                Access affordable farming spaces with AI-powered recommendations for optimal crop selection
                                and IoT-enabled smart farming tools.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">For Buyers</h5>
                            <p className="card-text">
                                Source fresh, hyperlocal, organic produce directly from urban farms.
                                Become a certified Green City Partner.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;