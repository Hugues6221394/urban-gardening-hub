import React from 'react';

const About = () => {
    return (
        <div>
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">About Urban Kitchen Gardening Hub</h2>

                            <div className="text-center mb-5">
                                <i className="fas fa-seedling fa-4x text-success mb-3"></i>
                                <p className="lead">
                                    Transforming urban spaces into thriving food sources through technology and community.
                                </p>
                            </div>

                            <div className="row mb-5">
                                <div className="col-md-6">
                                    <h4>Our Mission</h4>
                                    <p>
                                        Our mission is to address urban food security by transforming underutilized urban spaces
                                        into productive micro-farms. We leverage AI, IoT, and GIS technologies to optimize urban
                                        farming and create sustainable food systems in cities.
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h4>Our Vision</h4>
                                    <p>
                                        We envision cities where every rooftop, balcony, and vacant lot contributes to local food
                                        production, creating greener, more resilient urban environments with improved food security
                                        and economic opportunities for all residents.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4>How It Works</h4>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body text-center">
                                                <div className="bg-success bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                     style={{ width: '80px', height: '80px' }}>
                                                    <i className="fas fa-map-marker-alt fa-2x text-success"></i>
                                                </div>
                                                <h5>1. Space Identification</h5>
                                                <p>AI and GIS mapping analyze rooftops, parking lots, and vacant lands for ideal farming conditions.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body text-center">
                                                <div className="bg-success bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                     style={{ width: '80px', height: '80px' }}>
                                                    <i className="fas fa-robot fa-2x text-success"></i>
                                                </div>
                                                <h5>2. AI Crop Selection</h5>
                                                <p>AI recommends the best crops based on demand, season, and sustainability factors.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body text-center">
                                                <div className="bg-success bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                     style={{ width: '80px', height: '80px' }}>
                                                    <i className="fas fa-handshake fa-2x text-success"></i>
                                                </div>
                                                <h5>3. Matchmaking</h5>
                                                <p>Landowners connect with urban farmers, offering tax incentives for participation.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4>Benefits</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>For Urban Dwellers</h5>
                                        <ul>
                                            <li>Access to fresh, organic produce</li>
                                            <li>Income generation opportunities</li>
                                            <li>Reduced food expenses</li>
                                            <li>Community building</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h5>For Landowners</h5>
                                        <ul>
                                            <li>Passive income from unused spaces</li>
                                            <li>Tax incentives</li>
                                            <li>Property value enhancement</li>
                                            <li>Contribution to urban greening</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <h5>For Businesses</h5>
                                        <ul>
                                            <li>Reliable supply of hyperlocal produce</li>
                                            <li>Green City Partner certification</li>
                                            <li>Cost savings on ingredients</li>
                                            <li>Enhanced brand reputation</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h5>For the Environment</h5>
                                        <ul>
                                            <li>Reduced carbon footprint</li>
                                            <li>Improved urban biodiversity</li>
                                            <li>Reduced food miles</li>
                                            <li>Enhanced urban cooling</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4>Our Team</h4>
                                <p>
                                    We are a diverse team of agronomists, software engineers, urban planners, and sustainability
                                    experts passionate about creating resilient food systems for urban environments.
                                </p>
                            </div>

                            <div className="text-center">
                                <h4>Join the Movement</h4>
                                <p>
                                    Whether you're a landowner with unused space, an urban farmer looking for land, or a business
                                    interested in sourcing local produce, we invite you to join our growing community.
                                </p>
                                <a href="/signup" className="btn btn-success btn-lg me-2">Sign Up Today</a>
                                <a href="/contact" className="btn btn-outline-success btn-lg">Contact Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;