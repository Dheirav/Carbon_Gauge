import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import History from './components/History';
import Calculations from './components/Calculations';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Help from './components/Help';
import Layout from './components/layout/Layout';
import Analytics from './components/analytics/Analytics';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/calculations" element={<Calculations />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App; 