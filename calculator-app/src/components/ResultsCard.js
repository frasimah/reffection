import React from 'react';
import { formatNumber } from '../utils/calculations';
import { CONFIG } from '../constants';

const ResultsCard = ({ results, contacts, serviceType, averageCheck, techPackage }) => {
    
    const handleSubmit = () => {
        const submissionData = {
            timestamp: new Date().toISOString(),
            input: {
                serviceType: serviceType,
                serviceName: CONFIG.SERVICE_OPTIONS.find(opt => opt.id === serviceType)?.name || '',
                contacts: contacts,
                averageCheck: averageCheck,
                techPackage: techPackage,
                techPackagePrice: CONFIG.TECH_PACKAGES[techPackage]?.price || 0,
                techPackageDiscount: CONFIG.TECH_PACKAGES[techPackage]?.discount || 0
            },
            results: {
                totalCost: results.totalCost,
                conversionRate: results.conversionRate,
                expectedConversions: results.expectedConversions,
                costPerConversion: results.costPerConversion,
                packageCost: results.packageCost,
                totalCostWithPackage: results.totalCostWithPackage,
                contactProcessingCost: results.contactProcessingCost,
                isTechSubscription: results.isTechSubscription
            },
            calculations: {
                costPerContact: contacts > 0 && results.totalCost > 0 ? Math.round(results.totalCost / contacts) : 0,
                processingCostPerContact: contacts > 0 && results.contactProcessingCost > 0 ? Math.round(results.contactProcessingCost / contacts) : 0,
                conversionRatePercent: (results.conversionRate * 100).toFixed(1)
            }
        };
        
        const jsonString = JSON.stringify(submissionData, null, 2);
        console.log('Submission Data:', jsonString);
        
        // Create and download file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `calculator-results-${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Also copy to clipboard
        navigator.clipboard.writeText(jsonString).then(() => {
            console.log('Data copied to clipboard and downloaded as file');
            alert('Файл загружен в папку Downloads и данные скопированы в буфер обмена');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            alert('Файл загружен в папку Downloads');
        });
    };
    if (!results || contacts === 0) return (
        <div className="results-card placeholder">
            <div className="results-header">Результаты расчета</div>
            <p>Введите данные для расчета.</p>
        </div>
    );

    return (
        <div className="results-card">
            <div className="results-header">{results.expectedConversions > 0 ? `${formatNumber(results.expectedConversions)} лида (SQL)` : "0 лидов (SQL)"}</div>
            
            <div className="results-list">
                <div className="result-item">
                    <span className="result-text">Прогноз конверсии: {(results.conversionRate * 100).toFixed(1)}%</span>
                </div>
                
                <div className="result-item">
                    <span className="result-text">
                        {serviceType === 3 ? "Стоимость обработки" : "Стоимость данных"}: {contacts > 0 && results.totalCost > 0 ? Math.round(results.totalCost / contacts) : 0}₽/ед
                    </span>
                </div>
                
                {(serviceType === 1 || serviceType === 2) && (
                    <div className="result-item">
                        <span className="result-text">
                            Обработка контакта: {results.isTechSubscription ? "не включено" : `${contacts > 0 && results.contactProcessingCost > 0 ? Math.round(results.contactProcessingCost / contacts) : 0}₽/ед`}
                        </span>
                    </div>
                )}
                
                <div className="result-item">
                    <span className="result-text">Подписка: {formatNumber(results.packageCost)} ₽</span>
                </div>
                
                <div className="result-item">
                    <span className="result-text">Стоимость лида: {results.expectedConversions > 0 ? formatNumber(results.costPerConversion) : 0} ₽/ед</span>
                </div>
            </div>
            
            <div className="budget-section">
                <div className="budget-label">Бюджет:</div>
                <div className="budget-value">{formatNumber(results.totalCostWithPackage)} ₽</div>
            </div>
            
            <button className="submit-button" onClick={handleSubmit}>
                <span className="submit-text">ВЫБРАТЬ</span>
            </button>
        </div>
    );
};

export default ResultsCard;