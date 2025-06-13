import React from 'react';

const InfoIcon = ({ onClick }) => (
    <svg 
        className="info-icon" 
        onClick={() => {
            console.log('InfoIcon clicked');
            onClick && onClick();
        }} 
        viewBox="0 0 16 16" 
        style={{width: '16px', height: '16px', cursor: 'pointer', fill: '#FFFFFF', zIndex: 10, position: 'relative'}}
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

export default InfoIcon;