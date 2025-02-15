import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Calculator from './components/calculator/Calculator';
import History from './components/history/History';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Calculations from './components/Calculations';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Help from './components/Help';
import Analytics from './components/analytics/Analytics';
import Suggestions from './components/suggestions/Suggestions';
import ExportData from './components/export/ExportData';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/calculations" element={<Calculations />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/suggestions" element={<Suggestions />} />
                    <Route path="/export" element={<ExportData />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App; 