import React from 'react';
import { CONFIG } from '../constants';

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

export default SubscriptionSelector;