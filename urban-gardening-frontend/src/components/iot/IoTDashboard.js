// src/components/iot/IoTDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const IoTDashboard = () => {
    const [spaceId, setSpaceId] = useState('');
    const [sensorData, setSensorData] = useState({});
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('24h');

    useEffect(() => {
        if (spaceId) {
            fetchSensorData();
        }
    }, [spaceId, timeRange]);

    const fetchSensorData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8083/api/iot/data/${spaceId}?hours=${timeRange === '24h' ? 24 : 168}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            processSensorData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            setLoading(false);
        }
    };

    const processSensorData = (data) => {
        // Group data by sensor type and prepare for charts
        const processedData = {
            soilMoisture: { labels: [], values: [] },
            temperature: { labels: [], values: [] },
            humidity: { labels: [], values: [] },
            light: { labels: [], values: [] },
            ph: { labels: [], values: [] }
        };

        data.forEach(item => {
            const timeLabel = new Date(item.timestamp).toLocaleTimeString();

            if (item.sensorType === 'SOIL_MOISTURE' && item.soilMoisture !== null) {
                processedData.soilMoisture.labels.push(timeLabel);
                processedData.soilMoisture.values.push(item.soilMoisture);
            }

            if (item.sensorType === 'TEMPERATURE' && item.temperature !== null) {
                processedData.temperature.labels.push(timeLabel);
                processedData.temperature.values.push(item.temperature);
            }

            if (item.sensorType === 'HUMIDITY' && item.humidity !== null) {
                processedData.humidity.labels.push(timeLabel);
                processedData.humidity.values.push(item.humidity);
            }

            if (item.sensorType === 'LIGHT' && item.lightIntensity !== null) {
                processedData.light.labels.push(timeLabel);
                processedData.light.values.push(item.lightIntensity);
            }

            if (item.sensorType === 'PH_LEVEL' && item.phLevel !== null) {
                processedData.ph.labels.push(timeLabel);
                processedData.ph.values.push(item.phLevel);
            }
        });

        setSensorData(processedData);
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const SoilMoistureChart = () => {
        const data = {
            labels: sensorData.soilMoisture?.labels || [],
            datasets: [
                {
                    label: 'Soil Moisture (%)',
                    data: sensorData.soilMoisture?.values || [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
            ],
        };

        return <Line options={chartOptions} data={data} />;
    };

    const TemperatureChart = () => {
        const data = {
            labels: sensorData.temperature?.labels || [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: sensorData.temperature?.values || [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        };

        return <Line options={chartOptions} data={data} />;
    };

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>IoT Sensor Dashboard</h2>
                </div>
                <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-end">
                        <select
                            className="form-select w-auto"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                        </select>
                        <select
                            className="form-select w-auto"
                            value={spaceId}
                            onChange={(e) => setSpaceId(e.target.value)}
                        >
                            <option value="">Select Space</option>
                            {/* This would be populated with user's spaces */}
                            <option value="1">Space 1</option>
                            <option value="2">Space 2</option>
                        </select>
                    </div>
                </div>
            </div>

            {!spaceId ? (
                <div className="alert alert-info">
                    Please select a space to view sensor data.
                </div>
            ) : loading ? (
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading sensor data...</p>
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5>Soil Moisture</h5>
                            </div>
                            <div className="card-body">
                                {sensorData.soilMoisture?.values.length > 0 ? (
                                    <SoilMoistureChart />
                                ) : (
                                    <p className="text-muted">No soil moisture data available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5>Temperature</h5>
                            </div>
                            <div className="card-body">
                                {sensorData.temperature?.values.length > 0 ? (
                                    <TemperatureChart />
                                ) : (
                                    <p className="text-muted">No temperature data available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5>Current Readings</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="text-center p-3 bg-light rounded">
                                            <i className="fas fa-temperature-high fa-2x text-danger mb-2"></i>
                                            <h4>25°C</h4>
                                            <small className="text-muted">Temperature</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-3 bg-light rounded">
                                            <i className="fas fa-tint fa-2x text-info mb-2"></i>
                                            <h4>45%</h4>
                                            <small className="text-muted">Soil Moisture</small>
                                        </div>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <div className="text-center p-3 bg-light rounded">
                                            <i className="fas fa-sun fa-2x text-warning mb-2"></i>
                                            <h4>6.8</h4>
                                            <small className="text-muted">pH Level</small>
                                        </div>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <div className="text-center p-3 bg-light rounded">
                                            <i className="fas fa-cloud fa-2x text-primary mb-2"></i>
                                            <h4>65%</h4>
                                            <small className="text-muted">Humidity</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5>Irrigation Control</h5>
                            </div>
                            <div className="card-body">
                                <div className="text-center">
                                    <i className="fas fa-tint fa-3x text-info mb-3"></i>
                                    <h4>Irrigation System</h4>
                                    <p className="text-muted">Control your automated irrigation system</p>

                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-success">
                                            <i className="fas fa-play me-1"></i> Start
                                        </button>
                                        <button type="button" className="btn btn-danger">
                                            <i className="fas fa-stop me-1"></i> Stop
                                        </button>
                                    </div>

                                    <div className="mt-3">
                                        <label htmlFor="irrigationDuration" className="form-label">Duration (minutes)</label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            id="irrigationDuration"
                                            min="1"
                                            max="60"
                                            step="1"
                                        />
                                        <div className="d-flex justify-content-between">
                                            <small>1 min</small>
                                            <small>30 min</small>
                                            <small>60 min</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IoTDashboard;