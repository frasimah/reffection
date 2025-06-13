import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock configuration
const CONFIG = {
    SERVICE_OPTIONS: [
        { id: 1, name: "Segment_scoring" },
        { id: 2, name: "Retargeting Trigger Leads" },
        { id: 3, name: "Reactivation/Validation" }
    ],
    SUBSCRIPTION_OPTIONS: [
        { id: "tech", name: "Tech" },
        { id: "must", name: "Must" },
        { id: "pro", name: "Pro" },
        { id: "call", name: "Call" }
    ]
};

// Component implementations for testing
const InfoIcon = ({ onClick }) => (
    <svg 
        className="info-icon" 
        onClick={onClick} 
        viewBox="0 0 16 16" 
        style={{width: '16px', height: '16px', cursor: 'pointer', fill: '#FFFFFF'}}
        role="button"
        tabIndex={0}
        aria-label="Информация о услугах"
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick && onClick();
            }
        }}
    >
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
    </svg>
);

const ServiceSelector = ({ serviceType, onServiceChange, isDropdownOpen, onToggleDropdown, onInfoClick }) => (
    <div className="product-section">
        <div className="section-title-container">
            <label htmlFor="serviceTypeSelector" className="section-title">Выберите услугу</label>
            <InfoIcon onClick={onInfoClick} />
        </div>
        <div 
            id="serviceTypeSelector"
            className="dropdown-selector"
            onClick={onToggleDropdown}
            role="combobox"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-controls="serviceTypeDropdown"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleDropdown();
                }
            }}
        >
            <div className="dropdown-value">
                {CONFIG.SERVICE_OPTIONS.find(option => option.id === serviceType)?.name || "Segment_scoring"}
            </div>
            <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} viewBox="0 0 12 6">
                <path d="M1 1L6 5L11 1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        {isDropdownOpen && (
            <div className="dropdown-menu" role="listbox">
                {CONFIG.SERVICE_OPTIONS.map(option => (
                    <div 
                        key={option.id}
                        className={`dropdown-item ${serviceType === option.id ? 'selected' : ''}`}
                        onClick={() => onServiceChange(option.id)}
                        role="option"
                        tabIndex={0}
                        aria-selected={serviceType === option.id}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onServiceChange(option.id);
                            }
                        }}
                    >
                        {option.name}
                    </div>
                ))}
            </div>
        )}
    </div>
);

const formatNumber = (num) => num.toLocaleString('ru-RU');

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

const SubscriptionSelector = ({ 
    serviceType, 
    techPackage, 
    onTechPackageChange, 
    isDropdownOpen, 
    onToggleDropdown 
}) => {
    const getSelectedSubscriptionName = () => {
        const packageToId = {
            "Стандарт": "tech",
            "Премиум": "must",
            "Бизнес": "pro",
            "Call": "call"
        };
        const subscriptionId = packageToId[techPackage] || "tech";
        const selected = CONFIG.SUBSCRIPTION_OPTIONS.find(option => option.id === subscriptionId);
        return selected ? selected.name : "Tech";
    };

    return (
        <div className="subscription-section">
            <div className="section-title-container">
                <div className="section-title">Введите тип подписки</div>
            </div>
            <div 
                className={`subscription-selector ${serviceType === 3 ? 'disabled' : ''}`} 
                onClick={onToggleDropdown}
                style={{
                    opacity: serviceType === 3 ? 0.6 : 1,
                    cursor: serviceType === 3 ? 'not-allowed' : 'pointer'
                }}
                role="combobox"
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                aria-controls="subscriptionDropdown"
                tabIndex={serviceType === 3 ? -1 : 0}
                onKeyDown={(e) => {
                   if ((e.key === 'Enter' || e.key === ' ') && serviceType !== 3) {
                       e.preventDefault();
                       onToggleDropdown();
                   }
               }}
            >
                <div className="subscription-value">{getSelectedSubscriptionName()}</div>
                <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} viewBox="0 0 12 6">
                    <path d="M1 1L6 5L11 1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {isDropdownOpen && (serviceType === 1 || serviceType === 2) && (
                <div className="subscription-dropdown-menu">
                    {CONFIG.SUBSCRIPTION_OPTIONS
                        .filter(option => option.id !== 'call')
                        .map(option => (
                            <div 
                                key={option.id}
                                className={`subscription-dropdown-item ${(() => {
                                    const packageToId = {
                                        "Стандарт": "tech",
                                        "Премиум": "must",
                                        "Бизнес": "pro"
                                    };
                                    return packageToId[techPackage] === option.id ? 'selected' : '';
                                })()} `}
                                onClick={() => onTechPackageChange(option.id)}
                                role="option"
                                tabIndex={0}
                                aria-selected={(() => {
                                    const packageToId = {
                                        "Стандарт": "tech",
                                        "Премиум": "must",
                                        "Бизнес": "pro"
                                    };
                                    return packageToId[techPackage] === option.id;
                                })()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onTechPackageChange(option.id);
                                    }
                                }}
                            >
                                {option.name}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

const ResultsCard = ({ results, contacts, serviceType }) => {
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
            
            <button className="submit-button">
                <span className="submit-text">ВЫБРАТЬ</span>
            </button>
        </div>
    );
};

describe('ServiceSelector Component Tests', () => {
    const defaultProps = {
        serviceType: 1,
        onServiceChange: jest.fn(),
        isDropdownOpen: false,
        onToggleDropdown: jest.fn(),
        onInfoClick: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders service selector with correct initial state', () => {
        render(<ServiceSelector {...defaultProps} />);
        
        expect(screen.getByText('Выберите услугу')).toBeInTheDocument();
        expect(screen.getByText('Segment_scoring')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('shows dropdown when isDropdownOpen is true', () => {
        render(<ServiceSelector {...defaultProps} isDropdownOpen={true} />);
        
        expect(screen.getByText('Retargeting Trigger Leads')).toBeInTheDocument();
        expect(screen.getByText('Reactivation/Validation')).toBeInTheDocument();
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('calls onToggleDropdown when clicked', () => {
        render(<ServiceSelector {...defaultProps} />);
        
        fireEvent.click(screen.getByRole('combobox'));
        expect(defaultProps.onToggleDropdown).toHaveBeenCalledTimes(1);
    });

    test('calls onServiceChange when option is selected', () => {
        render(<ServiceSelector {...defaultProps} isDropdownOpen={true} />);
        
        fireEvent.click(screen.getByText('Retargeting Trigger Leads'));
        expect(defaultProps.onServiceChange).toHaveBeenCalledWith(2);
    });

    test('handles keyboard navigation on combobox', () => {
        render(<ServiceSelector {...defaultProps} />);
        
        const combobox = screen.getByRole('combobox');
        fireEvent.keyDown(combobox, { key: 'Enter' });
        expect(defaultProps.onToggleDropdown).toHaveBeenCalledTimes(1);
        
        fireEvent.keyDown(combobox, { key: ' ' });
        expect(defaultProps.onToggleDropdown).toHaveBeenCalledTimes(2);
    });

    test('handles keyboard navigation on dropdown options', () => {
        render(<ServiceSelector {...defaultProps} isDropdownOpen={true} />);
        
        const option = screen.getByText('Retargeting Trigger Leads');
        fireEvent.keyDown(option, { key: 'Enter' });
        expect(defaultProps.onServiceChange).toHaveBeenCalledWith(2);
    });

    test('calls onInfoClick when info icon is clicked', () => {
        render(<ServiceSelector {...defaultProps} />);
        
        const infoIcon = screen.getByRole('button');
        fireEvent.click(infoIcon);
        expect(defaultProps.onInfoClick).toHaveBeenCalledTimes(1);
    });

    test('displays correct service name for different service types', () => {
        const { rerender } = render(<ServiceSelector {...defaultProps} serviceType={2} />);
        expect(screen.getByText('Retargeting Trigger Leads')).toBeInTheDocument();
        
        rerender(<ServiceSelector {...defaultProps} serviceType={3} />);
        expect(screen.getByText('Reactivation/Validation')).toBeInTheDocument();
    });
});

describe('AverageCheckInput Component Tests', () => {
    const defaultProps = {
        averageCheck: 100000,
        onAverageCheckChange: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders input with correct label and placeholder', () => {
        render(<AverageCheckInput {...defaultProps} />);
        
        expect(screen.getByText('Средний чек продажи (руб)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Введите сумму в рублях |')).toBeInTheDocument();
    });

    test('displays formatted value correctly', () => {
        render(<AverageCheckInput {...defaultProps} />);
        
        const input = screen.getByRole('textbox');
        expect(input.value).toBe('100 000');
    });

    test('handles empty value correctly', () => {
        render(<AverageCheckInput {...defaultProps} averageCheck={0} />);
        
        const input = screen.getByRole('textbox');
        expect(input.value).toBe('');
    });

    test('filters non-numeric characters', () => {
        render(<AverageCheckInput {...defaultProps} />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'abc123def456' } });
        
        expect(defaultProps.onAverageCheckChange).toHaveBeenCalledWith(123456);
    });

    test('handles pure text input', () => {
        render(<AverageCheckInput {...defaultProps} />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'abcdef' } });
        
        expect(defaultProps.onAverageCheckChange).toHaveBeenCalledWith(0);
    });

    test('handles numeric input correctly', () => {
        render(<AverageCheckInput {...defaultProps} />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '250000' } });
        
        expect(defaultProps.onAverageCheckChange).toHaveBeenCalledWith(250000);
    });

    test('has correct accessibility attributes', () => {
        render(<AverageCheckInput {...defaultProps} />);
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-label', 'Средний чек продажи в рублях');
        expect(input).toHaveAttribute('inputMode', 'numeric');
        expect(input).toHaveAttribute('id', 'averageCheck');
    });
});

describe('SubscriptionSelector Component Tests', () => {
    const defaultProps = {
        serviceType: 1,
        techPackage: "Стандарт",
        onTechPackageChange: jest.fn(),
        isDropdownOpen: false,
        onToggleDropdown: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders subscription selector with correct title', () => {
        render(<SubscriptionSelector {...defaultProps} />);
        
        expect(screen.getByText('Введите тип подписки')).toBeInTheDocument();
        expect(screen.getByText('Tech')).toBeInTheDocument();
    });

    test('displays correct subscription name based on tech package', () => {
        const { rerender } = render(<SubscriptionSelector {...defaultProps} techPackage="Премиум" />);
        expect(screen.getByText('Must')).toBeInTheDocument();
        
        rerender(<SubscriptionSelector {...defaultProps} techPackage="Бизнес" />);
        expect(screen.getByText('Pro')).toBeInTheDocument();
    });

    test('shows dropdown options when open for service types 1 and 2', () => {
        render(<SubscriptionSelector {...defaultProps} isDropdownOpen={true} />);
        
        expect(screen.getByText('Tech')).toBeInTheDocument();
        expect(screen.getByText('Must')).toBeInTheDocument();
        expect(screen.getByText('Pro')).toBeInTheDocument();
        expect(screen.queryByText('Call')).not.toBeInTheDocument(); // Should be filtered out
    });

    test('disables dropdown for service type 3 (call center)', () => {
        render(<SubscriptionSelector {...defaultProps} serviceType={3} />);
        
        const selector = screen.getByRole('combobox');
        expect(selector).toHaveStyle({ opacity: '0.6', cursor: 'not-allowed' });
        expect(selector).toHaveAttribute('tabIndex', '-1');
    });

    test('does not show dropdown for service type 3 even when isDropdownOpen is true', () => {
        render(<SubscriptionSelector {...defaultProps} serviceType={3} isDropdownOpen={true} />);
        
        expect(screen.queryByText('Must')).not.toBeInTheDocument();
        expect(screen.queryByText('Pro')).not.toBeInTheDocument();
    });

    test('calls onToggleDropdown when clicked (for non-call center services)', () => {
        render(<SubscriptionSelector {...defaultProps} />);
        
        fireEvent.click(screen.getByRole('combobox'));
        expect(defaultProps.onToggleDropdown).toHaveBeenCalledTimes(1);
    });

    test('does not call onToggleDropdown for service type 3', () => {
        render(<SubscriptionSelector {...defaultProps} serviceType={3} />);
        
        fireEvent.click(screen.getByRole('combobox'));
        expect(defaultProps.onToggleDropdown).not.toHaveBeenCalled();
    });

    test('calls onTechPackageChange when option is selected', () => {
        render(<SubscriptionSelector {...defaultProps} isDropdownOpen={true} />);
        
        fireEvent.click(screen.getByText('Must'));
        expect(defaultProps.onTechPackageChange).toHaveBeenCalledWith('must');
    });

    test('handles keyboard navigation correctly', () => {
        render(<SubscriptionSelector {...defaultProps} />);
        
        const selector = screen.getByRole('combobox');
        fireEvent.keyDown(selector, { key: 'Enter' });
        expect(defaultProps.onToggleDropdown).toHaveBeenCalledTimes(1);
    });

    test('ignores keyboard events for service type 3', () => {
        render(<SubscriptionSelector {...defaultProps} serviceType={3} />);
        
        const selector = screen.getByRole('combobox');
        fireEvent.keyDown(selector, { key: 'Enter' });
        expect(defaultProps.onToggleDropdown).not.toHaveBeenCalled();
    });
});

describe('ResultsCard Component Tests', () => {
    const mockResults = {
        expectedConversions: 20,
        conversionRate: 0.02,
        totalCost: 70000,
        contactProcessingCost: 10000,
        packageCost: 14900,
        costPerConversion: 4245,
        totalCostWithPackage: 84900,
        isTechSubscription: false
    };

    test('renders placeholder when no results or zero contacts', () => {
        render(<ResultsCard results={null} contacts={0} serviceType={1} />);
        
        expect(screen.getByText('Результаты расчета')).toBeInTheDocument();
        expect(screen.getByText('Введите данные для расчета.')).toBeInTheDocument();
    });

    test('renders results with data correctly', () => {
        render(<ResultsCard results={mockResults} contacts={1000} serviceType={1} />);
        
        expect(screen.getByText('20 лида (SQL)')).toBeInTheDocument();
        expect(screen.getByText('Прогноз конверсии: 2.0%')).toBeInTheDocument();
        expect(screen.getByText('Бюджет:')).toBeInTheDocument();
        expect(screen.getByText('84 900 ₽')).toBeInTheDocument();
    });

    test('shows processing cost for non-tech subscriptions', () => {
        render(<ResultsCard results={mockResults} contacts={1000} serviceType={1} />);
        
        expect(screen.getByText(/Обработка контакта:/)).toBeInTheDocument();
        expect(screen.getByText(/10₽\/ед/)).toBeInTheDocument();
    });

    test('shows "не включено" for tech subscriptions', () => {
        const techResults = { ...mockResults, isTechSubscription: true };
        render(<ResultsCard results={techResults} contacts={1000} serviceType={1} />);
        
        expect(screen.getByText(/не включено/)).toBeInTheDocument();
    });

    test('shows different text for call center service', () => {
        render(<ResultsCard results={mockResults} contacts={1000} serviceType={3} />);
        
        expect(screen.getByText(/Стоимость обработки:/)).toBeInTheDocument();
    });

    test('handles zero conversions correctly', () => {
        const zeroResults = { ...mockResults, expectedConversions: 0, costPerConversion: 0 };
        render(<ResultsCard results={zeroResults} contacts={1000} serviceType={1} />);
        
        expect(screen.getByText('0 лидов (SQL)')).toBeInTheDocument();
        expect(screen.getByText(/Стоимость лида: 0 ₽\/ед/)).toBeInTheDocument();
    });

    test('renders submit button', () => {
        render(<ResultsCard results={mockResults} contacts={1000} serviceType={1} />);
        
        expect(screen.getByText('ВЫБРАТЬ')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});