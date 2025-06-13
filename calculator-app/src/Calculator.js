import React, { useState, useEffect, useCallback } from 'react';
import './Calculator.css';
import { useCalculator } from './hooks/useCalculator';
import { useSlider } from './hooks/useSlider';
import ServiceSelector from './components/ServiceSelector';
import AverageCheckInput from './components/AverageCheckInput';
import ContactsSlider from './components/ContactsSlider';
import SubscriptionSelector from './components/SubscriptionSelector';
import ResultsCard from './components/ResultsCard';
import InfoModal from './components/InfoModal';




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


// Main Calculator Component
function Calculator() {
    const [serviceType, setServiceType] = useState(1);
    const [averageCheck, setAverageCheck] = useState(100000);
    const [techPackage, setTechPackage] = useState("Стандарт");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const sliderHookProps = useSlider(4500);
    const { value: contacts, sliderRef } = sliderHookProps;
    const results = useCalculator(serviceType, contacts, averageCheck, techPackage);
    
    const handleServiceChange = useCallback((serviceId) => {
        setServiceType(serviceId);
        setIsDropdownOpen(false);
        if (serviceId === 3) {
            setTechPackage("Call");
            setIsSubscriptionDropdownOpen(false);
        } else if (techPackage === "Call") {
            setTechPackage("Стандарт");
        }
    }, [techPackage]);
    
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
        console.log('Modal toggle called, current state:', isModalOpen);
        setIsModalOpen(prev => !prev);
    }, [isModalOpen]);


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
                averageCheck={averageCheck}
                techPackage={techPackage}
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