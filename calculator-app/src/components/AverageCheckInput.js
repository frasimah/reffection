import React from 'react';
import { formatNumber } from '../utils/calculations';

const AverageCheckInput = ({ averageCheck, onAverageCheckChange }) => (
    <div className="average-check-section">
        <label htmlFor="averageCheck" className="section-title">Средний чек продажи (руб)</label>
        <div className="input-container">
            <input 
                id="averageCheck"
                type="text" 
                className="input-field"
                value={averageCheck ? formatNumber(averageCheck) : ''}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onAverageCheckChange(parseInt(value) || 0);
                }}
                placeholder="Введите сумму в рублях |"
                aria-label="Средний чек продажи в рублях"
                inputMode="numeric"
            />
        </div>
    </div>
);

export default AverageCheckInput;