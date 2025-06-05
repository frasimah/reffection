import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Calculator.css';

// Configuration and constants
const CONFIG = {
    SERVICES: {
        1: "Target_pricing",
        2: "Retargeting pricing",
        3: "Колл-центр"
    },
    SERVICE_PRICING: {
        1: [
            {contacts: 0, price_per_contact: 70},
            {contacts: 1000, price_per_contact: 60},
            {contacts: 3000, price_per_contact: 50},
            {contacts: 4000, price_per_contact: 45},
            {contacts: 5000, price_per_contact: 43},
            {contacts: 6000, price_per_contact: 40},
            {contacts: 7000, price_per_contact: 36},
            {contacts: 8000, price_per_contact: 34},
            {contacts: 9000, price_per_contact: 32},
            {contacts: 10000, price_per_contact: 30},
            {contacts: 13000, price_per_contact: 29},
            {contacts: 15000, price_per_contact: 28},
            {contacts: 20000, price_per_contact: 26},
            {contacts: 25000, price_per_contact: 25},
            {contacts: 30000, price_per_contact: 24},
            {contacts: 35000, price_per_contact: 23},
            {contacts: 40000, price_per_contact: 22},
            {contacts: 45000, price_per_contact: 21},
            {contacts: 50000, price_per_contact: 20}
        ],
        2: [
            {contacts: 0, price_per_contact: 50},
            {contacts: 1000, price_per_contact: 45},
            {contacts: 3000, price_per_contact: 40},
            {contacts: 4000, price_per_contact: 38},
            {contacts: 5000, price_per_contact: 36},
            {contacts: 6000, price_per_contact: 34},
            {contacts: 7000, price_per_contact: 32},
            {contacts: 8000, price_per_contact: 30},
            {contacts: 9000, price_per_contact: 28},
            {contacts: 10000, price_per_contact: 26},
            {contacts: 13000, price_per_contact: 25},
            {contacts: 15000, price_per_contact: 24},
            {contacts: 20000, price_per_contact: 22},
            {contacts: 25000, price_per_contact: 21},
            {contacts: 30000, price_per_contact: 20},
            {contacts: 35000, price_per_contact: 19},
            {contacts: 40000, price_per_contact: 18},
            {contacts: 45000, price_per_contact: 17},
            {contacts: 50000, price_per_contact: 16}
        ],
        3: [
            {contacts: 0, price_per_call: 50},
            {contacts: 1000, price_per_call: 45},
            {contacts: 3000, price_per_call: 40},
            {contacts: 4000, price_per_call: 35},
            {contacts: 5000, price_per_call: 34},
            {contacts: 6000, price_per_call: 33},
            {contacts: 7000, price_per_call: 32},
            {contacts: 8000, price_per_call: 31},
            {contacts: 9000, price_per_call: 30},
            {contacts: 10000, price_per_call: 29},
            {contacts: 13000, price_per_call: 28},
            {contacts: 15000, price_per_call: 27},
            {contacts: 20000, price_per_call: 26},
            {contacts: 25000, price_per_call: 25},
            {contacts: 30000, price_per_call: 24},
            {contacts: 35000, price_per_call: 23},
            {contacts: 40000, price_per_call: 22},
            {contacts: 45000, price_per_call: 21},
            {contacts: 50000, price_per_call: 20}
        ]
    },
    TECH_PACKAGES: {
        "Стандарт": {"price": 14900, "discount": 0.0},
        "Премиум": {"price": 24900, "discount": 0.05},
        "Бизнес": {"price": 49900, "discount": 0.1},
        "Call": {"price": 4990, "discount": 0.0}
    },
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
    ],
    SLIDER: {
        MIN: 1000,
        MAX: 50000,
        STEP: 100
    }
};

// Business logic functions
const calculateCostByTiers = (contacts, pricing) => {
    let totalCost = 0;
    let remainingContacts = contacts;
    
    for (let i = 0; i < pricing.length; i++) {
        const tier = pricing[i];
        const nextTier = pricing[i + 1];
        
        const priceField = tier.price_per_contact || tier.price_per_call;
        
        if (nextTier) {
            const tierContacts = Math.min(remainingContacts, nextTier.contacts - tier.contacts);
            totalCost += tierContacts * priceField;
            remainingContacts -= tierContacts;
            
            if (remainingContacts <= 0) break;
        } else {
            totalCost += remainingContacts * priceField;
            break;
        }
    }
    
    return totalCost;
};

const getConversionRate = (averageCheck, serviceType) => {
    let baseRate;
    if (averageCheck < 100000) {
        baseRate = 0.03;
    } else if (averageCheck >= 100000 && averageCheck < 3000000) {
        baseRate = 0.02;
    } else {
        baseRate = 0.005;
    }
    
    if (serviceType === 2) {
        return baseRate * 2;
    } else if (serviceType === 3) {
        return baseRate * 1.5; // Assuming call center has a different conversion impact
    }
    return baseRate;
};

const getServicePrice = (serviceType, contacts) => {
    const pricing = CONFIG.SERVICE_PRICING[serviceType];
    if (!pricing) return 0;
    return calculateCostByTiers(contacts, pricing);
};

// Custom Hooks
const useCalculator = (serviceType, contacts, averageCheck, techPackageName) => {
    return useMemo(() => {
        if (!averageCheck || averageCheck <= 0) {
            return {
                totalCost: 0,
                conversionRate: 0,
                expectedConversions: 0,
                costPerConversion: 0,
                packageCost: 0,
                totalCostWithPackage: 0,
                contactProcessingCost: 0,
                isTechSubscription: false
            };
        }

        const techPackage = CONFIG.TECH_PACKAGES[techPackageName] || CONFIG.TECH_PACKAGES["Стандарт"];
        const packageCost = techPackage.price;
        const discount = techPackage.discount;

        let dataCost = getServicePrice(serviceType, contacts);
        let contactProcessingCost = 0;
        let isTechSubscription = techPackageName === "Стандарт" || techPackageName === "Call";

        if (serviceType === 1 || serviceType === 2) { // Target or Retargeting
            if (!isTechSubscription) { // Must or Pro
                contactProcessingCost = contacts * 10; // 10 rub per contact for processing
            }
        } else if (serviceType === 3) { // Call Center
            // Call center cost is already in dataCost, no separate processing cost
            isTechSubscription = true; // No separate processing for call center in this model
        }
        
        const totalServiceCost = dataCost + contactProcessingCost;
        const discountedServiceCost = totalServiceCost * (1 - discount);
        const totalCostWithPackage = discountedServiceCost + packageCost;
        
        const conversionRate = getConversionRate(averageCheck, serviceType);
        const expectedConversions = Math.round(contacts * conversionRate);
        const costPerConversion = expectedConversions > 0 ? Math.round(totalCostWithPackage / expectedConversions) : 0;

        return {
            totalCost: dataCost, // Cost of data/calls before package and discount
            conversionRate,
            expectedConversions,
            costPerConversion,
            packageCost,
            totalCostWithPackage, // Final budget
            contactProcessingCost, // Cost of processing for non-tech/non-call subscriptions
            isTechSubscription
        };
    }, [serviceType, contacts, averageCheck, techPackageName]);
};

const useSlider = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = React.useRef(null); 

    const updateSliderValue = useCallback((clientX) => {
        if (!sliderRef.current) return;
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        let newValue = ((clientX - rect.left) / rect.width) * (CONFIG.SLIDER.MAX - CONFIG.SLIDER.MIN) + CONFIG.SLIDER.MIN;
        newValue = Math.max(CONFIG.SLIDER.MIN, Math.min(CONFIG.SLIDER.MAX, newValue));
        newValue = Math.round(newValue / CONFIG.SLIDER.STEP) * CONFIG.SLIDER.STEP;
        setValue(newValue);
    }, [sliderRef]);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (isDragging) {
            updateSliderValue(event.clientX);
        }
    }, [isDragging, updateSliderValue]);
    
    const handleSliderChange = useCallback((event) => {
        setValue(parseInt(event.target.value));
    }, []);

    const handleTrackClick = useCallback((event) => {
        updateSliderValue(event.clientX);
    }, [updateSliderValue]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return { 
        value, 
        setValue, 
        isDragging, 
        handleThumbMouseDown: handleMouseDown, 
        handleSliderChange, 
        handleTrackClick,
        sliderRef // Export ref
    };
};

// Helper functions
const formatNumber = (num) => num.toLocaleString('ru-RU');

// validateProps function removed as it was unused

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

// Sub-components
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
                        .filter(option => option.id !== 'call') // Filter out 'Call' for service types 1 and 2
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

const ContactsSlider = ({ contacts, onContactsChange, isDragging, onThumbMouseDown, onTrackClick, sliderRef }) => (
    <>
        <label htmlFor="contactsSliderInput" className="contacts-title">Выберите количество контактов</label>
        <div className="contacts-section">
            <div 
                ref={sliderRef} // Assign ref here
                className="slider-container"
                onClick={onTrackClick}
                style={{ userSelect: 'none' }}
                role="slider"
                aria-valuemin={CONFIG.SLIDER.MIN}
                aria-valuemax={CONFIG.SLIDER.MAX}
                aria-valuenow={contacts}
                aria-label={`Количество контактов: ${formatNumber(contacts)}`}
            >
                <div 
                    className="slider-track"
                    style={{
                        '--slider-progress': `${((contacts - CONFIG.SLIDER.MIN) / (CONFIG.SLIDER.MAX - CONFIG.SLIDER.MIN)) * 100}%`
                    }}
                ></div>
                <input 
                    id="contactsSliderInput"
                    type="range" 
                    min={CONFIG.SLIDER.MIN}
                    max={CONFIG.SLIDER.MAX}
                    step={CONFIG.SLIDER.STEP}
                    value={contacts}
                    onChange={onContactsChange} // Use the passed onChange handler
                    className="slider-input-element" // Added a class for clarity
                    aria-label="Выберите количество контактов"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        pointerEvents: 'all', // Ensure it can receive events
                        zIndex: 2 // Ensure it's above the track but below thumb for clicks
                    }}
                />
                <div 
                    className="slider-thumb" 
                    style={{
                        left: `${((contacts - CONFIG.SLIDER.MIN) / (CONFIG.SLIDER.MAX - CONFIG.SLIDER.MIN)) * 100}%`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={onThumbMouseDown}
                    role="button"
                    tabIndex={-1} // Not focusable, input range handles focus
                    aria-hidden="true"
                ></div>
                <div 
                    className="slider-value"
                    style={{
                        left: `${((contacts - CONFIG.SLIDER.MIN) / (CONFIG.SLIDER.MAX - CONFIG.SLIDER.MIN)) * 100}%`
                    }}
                    aria-hidden="true"
                >{formatNumber(contacts)}</div>
            </div>
            <div className="slider-labels">
                <span className="slider-label">{formatNumber(CONFIG.SLIDER.MIN)}</span>
                <span className="slider-label">{formatNumber(CONFIG.SLIDER.MAX / 2)}</span>
                <span className="slider-label">{formatNumber(CONFIG.SLIDER.MAX)}</span>
            </div>
        </div>
    </>
);

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

const InfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
                <div className="modal-header">
                    <h3>Информация о услугах</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Закрыть модальное окно">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="subscription-info">
                        <h4>Retargeting Trigger Leads</h4>
                        <p>Идентифицирует скрытых посетителей на конкретных страницах сайтов рекламодателя через лёгкий JS-код, фиксирующий geo, источник визита, устройство, время и поведение на страницах. Сопоставляет данные с Big Data Reffection и создаёт уникальный профиль пользователя. Определяет триггеры (поведенческие сигналы), которые показывают, насколько клиент готов к покупке — и возвращает его в воронку продаж.</p>
                    </div>
                    <div className="subscription-info">
                        <h4>Segment Scoring</h4>
                        <p>Собирает данные на сайтах в нише рекламодателя, анализируя цифровой след пользователей через Big Data, DMP Reffection и ML-модели телеком-операторов. Определяет вероятностный уровень вовлечённости и платёжеспособности клиента, учитывая геолокацию, поведение в сети, звонковую активность и контентное потребление.</p>
                    </div>
                    <div className="subscription-info">
                        <h4>Reactivation/Validation</h4>
                        <p>Дозванивается до 90% клиентов, используя технологии обхода спам-фильтров и адаптивную телефонию. Сценарии разговоров адаптированы под вашу нишу — операторы обучены продукту. Фильтрует, квалифицирует и возвращает до 50% потерянных лидов обратно в воронку продаж.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Calculator Component
function Calculator() {
    const [serviceType, setServiceType] = useState(1);
    const [averageCheck, setAverageCheck] = useState(100000);
    const [techPackage, setTechPackage] = useState("Стандарт");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const sliderHookProps = useSlider(4500);
    const { value: contacts, sliderRef } = sliderHookProps; // Get sliderRef from hook
    const results = useCalculator(serviceType, contacts, averageCheck, techPackage);
    
    const handleServiceChange = useCallback((serviceId) => {
        setServiceType(serviceId);
        setIsDropdownOpen(false);
        if (serviceId === 3) {
            setTechPackage("Call");
            // Ensure subscription dropdown is closed if it was open for other services
            setIsSubscriptionDropdownOpen(false); 
        } else if (techPackage === "Call") {
            setTechPackage("Стандарт");
        }
    }, [techPackage, setTechPackage, setIsSubscriptionDropdownOpen]);
    
    const handleToggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
        setIsSubscriptionDropdownOpen(false); // Close other dropdown
    }, []);
    
    const handleSubscriptionDropdownToggle = useCallback(() => {
        if (serviceType === 3) return; // Disabled for Call Center
        setIsSubscriptionDropdownOpen(prev => !prev);
        setIsDropdownOpen(false); // Close other dropdown
    }, [serviceType]);
    
    const handleSubscriptionChange = useCallback((subscriptionId) => {
        const idToPackage = {
            "tech": "Стандарт",
            "must": "Премиум",
            "pro": "Бизнес"
            // "Call" is handled by serviceType change
        };
        if (idToPackage[subscriptionId]){
            setTechPackage(idToPackage[subscriptionId]);
        }
        setIsSubscriptionDropdownOpen(false);
    }, []);
    
    const handleModalToggle = useCallback(() => {
        setIsModalOpen(prev => !prev);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the main dropdown
            if (isDropdownOpen && !event.target.closest('.product-section .dropdown-selector') && !event.target.closest('.product-section .dropdown-menu')) {
                setIsDropdownOpen(false);
            }
            // Check if the click is outside the subscription dropdown
            if (isSubscriptionDropdownOpen && !event.target.closest('.subscription-section .subscription-selector') && !event.target.closest('.subscription-section .subscription-dropdown-menu')) {
                setIsSubscriptionDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, isSubscriptionDropdownOpen]);

    return (
        <div className="calculator-container">
            <div className="background-blur"></div>
            <header className="header">
                <h1>Калькулятор стоимости разработки</h1>
                <p>Узнайте примерную стоимость вашего проекта за 2 минуты</p>
            </header>
            
            <ServiceSelector 
                serviceType={serviceType}
                onServiceChange={handleServiceChange}
                isDropdownOpen={isDropdownOpen}
                onToggleDropdown={handleToggleDropdown}
                onInfoClick={handleModalToggle}
            />
            
            <AverageCheckInput 
                averageCheck={averageCheck}
                onAverageCheckChange={setAverageCheck}
            />
            
            <ContactsSlider 
                contacts={contacts}
                onContactsChange={sliderHookProps.handleSliderChange}
                isDragging={sliderHookProps.isDragging}
                onThumbMouseDown={sliderHookProps.handleThumbMouseDown}
                onTrackClick={sliderHookProps.handleTrackClick}
                sliderRef={sliderRef}
            />
            
            <SubscriptionSelector 
                serviceType={serviceType}
                techPackage={techPackage}
                onTechPackageChange={handleSubscriptionChange}
                isDropdownOpen={isSubscriptionDropdownOpen}
                onToggleDropdown={handleSubscriptionDropdownToggle}
            />
            
            <ResultsCard 
                results={results}
                contacts={contacts}
                serviceType={serviceType}
            />
            
            <InfoModal 
                isOpen={isModalOpen}
                onClose={handleModalToggle}
            />
            
            <div className="disclaimer">
                <p>* Это предварительная оценка. Точная стоимость определяется после детального анализа требований.</p>
            </div>
        </div>
    );
}

// Export Calculator as default and ErrorBoundary as named export
export { ErrorBoundary };
export default Calculator;