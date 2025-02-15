import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CalculationDetails = () => {
  const { token, user } = useAuth();
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    const fetchCalculation = async () => {
      const endpoint = user && user.role === 'industrial'
        ? '/api/calculations/industrial-results'
        : '/api/calculations/results';
      try {
        const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` }});
        setCalculation(response.data);
      } catch (err) {
        // handle error
      }
    };
    fetchCalculation();
  }, [token, user]);

  return (
    <div>
      {/* Existing UI for showing calculation results */}
    </div>
  );
};

export default CalculationDetails; 