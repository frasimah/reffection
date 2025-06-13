import { useMemo } from 'react';
import { CONFIG } from '../constants';
import { getConversionRate, getServicePrice } from '../utils/calculations';

export const useCalculator = (serviceType, contacts, averageCheck, techPackageName) => {
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