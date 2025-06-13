import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calculator, { ErrorBoundary } from './Calculator';

// Mock business logic functions for testing
const CONFIG = {
    SERVICE_PRICING: {
        1: [
            {contacts: 0, price_per_contact: 70},
            {contacts: 1000, price_per_contact: 60},
            {contacts: 3000, price_per_contact: 50},
            {contacts: 5000, price_per_contact: 43}
        ],
        2: [
            {contacts: 0, price_per_contact: 50},
            {contacts: 1000, price_per_contact: 45},
            {contacts: 3000, price_per_contact: 40}
        ],
        3: [
            {contacts: 0, price_per_call: 50},
            {contacts: 1000, price_per_call: 45}
        ]
    },
    TECH_PACKAGES: {
        "Стандарт": {"price": 14900, "discount": 0.0},
        "Премиум": {"price": 24900, "discount": 0.05},
        "Бизнес": {"price": 49900, "discount": 0.1}
    }
};

// Business logic functions (extracted from Calculator.js for testing)
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
        return baseRate * 1.5;
    }
    return baseRate;
};

const getServicePrice = (serviceType, contacts) => {
    const pricing = CONFIG.SERVICE_PRICING[serviceType];
    if (!pricing) return 0;
    return calculateCostByTiers(contacts, pricing);
};

describe('Business Logic Tests', () => {
    describe('calculateCostByTiers', () => {
        test('calculates cost for single tier', () => {
            const pricing = [{contacts: 0, price_per_contact: 70}];
            expect(calculateCostByTiers(500, pricing)).toBe(35000);
        });

        test('calculates cost across multiple tiers', () => {
            const pricing = [
                {contacts: 0, price_per_contact: 70},
                {contacts: 1000, price_per_contact: 60}
            ];
            // First 1000 contacts at 70, next 500 at 60
            expect(calculateCostByTiers(1500, pricing)).toBe(1000 * 70 + 500 * 60);
        });

        test('handles contacts exactly at tier boundary', () => {
            const pricing = [
                {contacts: 0, price_per_contact: 70},
                {contacts: 1000, price_per_contact: 60}
            ];
            expect(calculateCostByTiers(1000, pricing)).toBe(1000 * 70);
        });

        test('works with price_per_call field', () => {
            const pricing = [{contacts: 0, price_per_call: 50}];
            expect(calculateCostByTiers(100, pricing)).toBe(5000);
        });
    });

    describe('getConversionRate', () => {
        test('returns 3% for low average check', () => {
            expect(getConversionRate(50000, 1)).toBe(0.03);
        });

        test('returns 2% for medium average check', () => {
            expect(getConversionRate(150000, 1)).toBe(0.02);
        });

        test('returns 0.5% for high average check', () => {
            expect(getConversionRate(5000000, 1)).toBe(0.005);
        });

        test('doubles rate for retargeting service (type 2)', () => {
            expect(getConversionRate(150000, 2)).toBe(0.04);
        });

        test('multiplies by 1.5 for call center service (type 3)', () => {
            expect(getConversionRate(150000, 3)).toBe(0.03);
        });

        test('handles boundary values correctly', () => {
            expect(getConversionRate(100000, 1)).toBe(0.02);
            expect(getConversionRate(3000000, 1)).toBe(0.005);
        });
    });

    describe('getServicePrice', () => {
        test('returns 0 for invalid service type', () => {
            expect(getServicePrice(999, 1000)).toBe(0);
        });

        test('calculates price for service type 1', () => {
            const expected = calculateCostByTiers(1000, CONFIG.SERVICE_PRICING[1]);
            expect(getServicePrice(1, 1000)).toBe(expected);
        });

        test('calculates price for service type 2', () => {
            const expected = calculateCostByTiers(2000, CONFIG.SERVICE_PRICING[2]);
            expect(getServicePrice(2, 2000)).toBe(expected);
        });

        test('calculates price for service type 3', () => {
            const expected = calculateCostByTiers(500, CONFIG.SERVICE_PRICING[3]);
            expect(getServicePrice(3, 500)).toBe(expected);
        });
    });
});

describe('Calculator Component Tests', () => {
    test('renders main calculator elements', () => {
        render(<Calculator />);
        
        expect(screen.getByText('Калькулятор стоимости разработки')).toBeInTheDocument();
        expect(screen.getByText('Выберите услугу')).toBeInTheDocument();
        expect(screen.getByText('Средний чек продажи (руб)')).toBeInTheDocument();
        expect(screen.getByText('Выберите количество контактов')).toBeInTheDocument();
    });

    test('shows results card placeholder when no data', () => {
        render(<Calculator />);
        expect(screen.getByText('Введите данные для расчета.')).toBeInTheDocument();
    });

    test('service selector dropdown works', () => {
        render(<Calculator />);
        
        const serviceSelector = screen.getByRole('combobox');
        fireEvent.click(serviceSelector);
        
        expect(screen.getByText('Retargeting Trigger Leads')).toBeInTheDocument();
        expect(screen.getByText('Reactivation/Validation')).toBeInTheDocument();
    });

    test('average check input accepts numeric input', () => {
        render(<Calculator />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '200000' } });
        
        expect(input.value).toBe('200 000');
    });

    test('average check input filters non-numeric characters', () => {
        render(<Calculator />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'abc123def' } });
        
        expect(input.value).toBe('123');
    });
});

describe('ErrorBoundary Component', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    const ThrowError = ({ shouldThrow }) => {
        if (shouldThrow) {
            throw new Error('Test error');
        }
        return <div>No error</div>;
    };

    test('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        );
        
        expect(screen.getByText('No error')).toBeInTheDocument();
    });

    test('renders error message when there is an error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });
});

describe('Format Number Function', () => {
    const formatNumber = (num) => num.toLocaleString('ru-RU');

    test('formats numbers with Russian locale', () => {
        expect(formatNumber(1000)).toBe('1 000');
        expect(formatNumber(1000000)).toBe('1 000 000');
        expect(formatNumber(123456)).toBe('123 456');
    });

    test('handles zero and small numbers', () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(1)).toBe('1');
        expect(formatNumber(99)).toBe('99');
    });
});