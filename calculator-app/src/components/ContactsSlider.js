import React from 'react';
import { CONFIG } from '../constants';
import { formatNumber } from '../utils/calculations';

const ContactsSlider = ({ contacts, onContactsChange, isDragging, onThumbMouseDown, onTrackClick, sliderRef }) => (
    <>
        <label htmlFor="contactsSliderInput" className="contacts-title">Выберите количество контактов</label>
        <div className="contacts-section">
            <div 
                ref={sliderRef}
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
                    onChange={onContactsChange}
                    className="slider-input-element"
                    aria-label="Выберите количество контактов"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        pointerEvents: 'all',
                        zIndex: 2
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
                    tabIndex={-1}
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

export default ContactsSlider;