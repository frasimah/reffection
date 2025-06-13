import React from 'react';
import { CONFIG } from '../constants';
import InfoIcon from './InfoIcon';

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

export default ServiceSelector;