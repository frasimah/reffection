import { useState, useCallback, useEffect, useRef } from 'react';
import { CONFIG } from '../constants';

export const useSlider = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    const updateSliderValue = useCallback((clientX) => {
        if (!sliderRef.current) return;
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        let newValue = ((clientX - rect.left) / rect.width) * (CONFIG.SLIDER.MAX - CONFIG.SLIDER.MIN) + CONFIG.SLIDER.MIN;
        newValue = Math.max(CONFIG.SLIDER.MIN, Math.min(CONFIG.SLIDER.MAX, newValue));
        newValue = Math.round(newValue / CONFIG.SLIDER.STEP) * CONFIG.SLIDER.STEP;
        setValue(newValue);
    }, []);

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
        sliderRef
    };
};