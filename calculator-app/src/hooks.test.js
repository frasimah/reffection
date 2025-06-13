import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock the CONFIG and business logic functions
const CONFIG = {
    SERVICE_PRICING: {
        1: [
            {contacts: 0, price_per_contact: 70},
            {contacts: 1000, price_per_contact: 60},
            {contacts: 3000, price_per_contact: 50}
        ],
        2: [
            {contacts: 0, price_per_contact: 50},
            {contacts: 1000, price_per_contact: 45}
        ],
        3: [
            {contacts: 0, price_per_call: 50},
            {contacts: 1000, price_per_call: 45}
        ]
    },
    TECH_PACKAGES: {
        "Стандарт": {"price": 14900, "discount": 0.0},
        "Премиум": {"price": 24900, "discount": 0.05},
        "Бизнес": {"price": 49900, "discount": 0.1},
        "Call": {"price": 4990, "discount": 0.0}
    },
    SLIDER: {
        MIN: 1000,
        MAX: 50000,
        STEP: 100
    }
};

// Business logic functions (extracted from Calculator.js)
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

// useCalculator hook implementation
const useCalculator = (serviceType, contacts, averageCheck, techPackageName) => {
    return React.useMemo(() => {
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

        if (serviceType === 1 || serviceType === 2) {
            if (!isTechSubscription) {
                contactProcessingCost = contacts * 10;
            }
        } else if (serviceType === 3) {
            isTechSubscription = true;
        }
        
        const totalServiceCost = dataCost + contactProcessingCost;
        const discountedServiceCost = totalServiceCost * (1 - discount);
        const totalCostWithPackage = discountedServiceCost + packageCost;
        
        const conversionRate = getConversionRate(averageCheck, serviceType);
        const expectedConversions = Math.round(contacts * conversionRate);
        const costPerConversion = expectedConversions > 0 ? Math.round(totalCostWithPackage / expectedConversions) : 0;

        return {
            totalCost: dataCost,
            conversionRate,
            expectedConversions,
            costPerConversion,
            packageCost,
            totalCostWithPackage,
            contactProcessingCost,
            isTechSubscription
        };
    }, [serviceType, contacts, averageCheck, techPackageName]);
};

// useSlider hook implementation  
const useSlider = (initialValue) => {
    const [value, setValue] = React.useState(initialValue);
    const [isDragging, setIsDragging] = React.useState(false);
    const sliderRef = React.useRef(null);

    const updateSliderValue = React.useCallback((clientX) => {
        if (!sliderRef.current) return;
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        let newValue = ((clientX - rect.left) / rect.width) * (CONFIG.SLIDER.MAX - CONFIG.SLIDER.MIN) + CONFIG.SLIDER.MIN;
        newValue = Math.max(CONFIG.SLIDER.MIN, Math.min(CONFIG.SLIDER.MAX, newValue));
        newValue = Math.round(newValue / CONFIG.SLIDER.STEP) * CONFIG.SLIDER.STEP;
        setValue(newValue);
    }, [sliderRef]);

    const handleMouseDown = React.useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleSliderChange = React.useCallback((event) => {
        setValue(parseInt(event.target.value));
    }, []);

    const handleTrackClick = React.useCallback((event) => {
        updateSliderValue(event.clientX);
    }, [updateSliderValue]);

    return { 
        value, 
        setValue, 
        isDragging, 
        handleThumbMouseDown: handleMouseDown, 
        handleSliderChange, 
        handleTrackClick,
        sliderRef
    };
};

describe('useCalculator Hook Tests', () => {
    test('returns zero values when averageCheck is 0', () => {
        const { result } = renderHook(() => useCalculator(1, 1000, 0, "Стандарт"));
        
        expect(result.current.totalCost).toBe(0);
        expect(result.current.conversionRate).toBe(0);
        expect(result.current.expectedConversions).toBe(0);
        expect(result.current.costPerConversion).toBe(0);
        expect(result.current.packageCost).toBe(0);
        expect(result.current.totalCostWithPackage).toBe(0);
    });

    test('calculates correct values for service type 1 with standard package', () => {
        const { result } = renderHook(() => useCalculator(1, 1000, 100000, "Стандарт"));
        
        expect(result.current.conversionRate).toBe(0.02);
        expect(result.current.expectedConversions).toBe(20);
        expect(result.current.packageCost).toBe(14900);
        expect(result.current.isTechSubscription).toBe(true);
        expect(result.current.contactProcessingCost).toBe(0);
    });

    test('calculates correct values for service type 1 with premium package', () => {
        const { result } = renderHook(() => useCalculator(1, 1000, 100000, "Премиум"));
        
        expect(result.current.conversionRate).toBe(0.02);
        expect(result.current.packageCost).toBe(24900);
        expect(result.current.isTechSubscription).toBe(false);
        expect(result.current.contactProcessingCost).toBe(10000); // 1000 * 10
    });

    test('calculates correct values for service type 2 (retargeting)', () => {
        const { result } = renderHook(() => useCalculator(2, 1000, 100000, "Стандарт"));
        
        expect(result.current.conversionRate).toBe(0.04); // doubled for retargeting
        expect(result.current.expectedConversions).toBe(40);
    });

    test('calculates correct values for service type 3 (call center)', () => {
        const { result } = renderHook(() => useCalculator(3, 1000, 100000, "Call"));
        
        expect(result.current.conversionRate).toBe(0.03); // 1.5x for call center
        expect(result.current.packageCost).toBe(4990);
        expect(result.current.isTechSubscription).toBe(true);
        expect(result.current.contactProcessingCost).toBe(0);
    });

    test('applies discount correctly for business package', () => {
        const { result } = renderHook(() => useCalculator(1, 1000, 100000, "Бизнес"));
        
        const dataCost = getServicePrice(1, 1000);
        const contactProcessingCost = 1000 * 10; // Not tech subscription
        const totalServiceCost = dataCost + contactProcessingCost;
        const discountedCost = totalServiceCost * 0.9; // 10% discount
        const expectedTotal = discountedCost + 49900; // Package cost
        
        expect(result.current.totalCostWithPackage).toBe(expectedTotal);
    });

    test('recalculates when parameters change', () => {
        let serviceType = 1;
        let contacts = 1000;
        let averageCheck = 100000;
        let techPackage = "Стандарт";

        const { result, rerender } = renderHook(() => 
            useCalculator(serviceType, contacts, averageCheck, techPackage)
        );

        const initialResult = result.current;

        // Change service type
        serviceType = 2;
        rerender();
        
        expect(result.current.conversionRate).not.toBe(initialResult.conversionRate);
        expect(result.current.conversionRate).toBe(0.04); // Doubled for retargeting
    });

    test('handles edge case of very high average check', () => {
        const { result } = renderHook(() => useCalculator(1, 1000, 5000000, "Стандарт"));
        
        expect(result.current.conversionRate).toBe(0.005);
        expect(result.current.expectedConversions).toBe(5);
    });

    test('handles zero contacts', () => {
        const { result } = renderHook(() => useCalculator(1, 0, 100000, "Стандарт"));
        
        expect(result.current.expectedConversions).toBe(0);
        expect(result.current.costPerConversion).toBe(0);
    });
});

describe('useSlider Hook Tests', () => {
    test('initializes with correct value', () => {
        const { result } = renderHook(() => useSlider(5000));
        
        expect(result.current.value).toBe(5000);
        expect(result.current.isDragging).toBe(false);
    });

    test('setValue updates the value', () => {
        const { result } = renderHook(() => useSlider(1000));
        
        act(() => {
            result.current.setValue(2000);
        });
        
        expect(result.current.value).toBe(2000);
    });

    test('handleSliderChange parses and sets value', () => {
        const { result } = renderHook(() => useSlider(1000));
        
        const mockEvent = {
            target: { value: '3000' }
        };
        
        act(() => {
            result.current.handleSliderChange(mockEvent);
        });
        
        expect(result.current.value).toBe(3000);
    });

    test('handleThumbMouseDown sets dragging to true', () => {
        const { result } = renderHook(() => useSlider(1000));
        
        act(() => {
            result.current.handleThumbMouseDown();
        });
        
        expect(result.current.isDragging).toBe(true);
    });

    test('provides all required methods and properties', () => {
        const { result } = renderHook(() => useSlider(1000));
        
        expect(typeof result.current.value).toBe('number');
        expect(typeof result.current.setValue).toBe('function');
        expect(typeof result.current.isDragging).toBe('boolean');
        expect(typeof result.current.handleThumbMouseDown).toBe('function');
        expect(typeof result.current.handleSliderChange).toBe('function');
        expect(typeof result.current.handleTrackClick).toBe('function');
        expect(result.current.sliderRef).toBeDefined();
    });

    test('slider ref is properly initialized', () => {
        const { result } = renderHook(() => useSlider(1000));
        
        expect(result.current.sliderRef.current).toBe(null);
    });
});