import { CONFIG } from '../constants';

export const calculateCostByTiers = (contacts, pricing) => {
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

export const getConversionRate = (averageCheck, serviceType) => {
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

export const getServicePrice = (serviceType, contacts) => {
    const pricing = CONFIG.SERVICE_PRICING[serviceType];
    if (!pricing) return 0;
    return calculateCostByTiers(contacts, pricing);
};

export const formatNumber = (num) => num.toLocaleString('ru-RU');