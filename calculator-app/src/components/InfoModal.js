import React from 'react';

const InfoModal = ({ isOpen, onClose }) => {
    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} 
             style={{ display: isOpen ? 'flex' : 'none' }}
             onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
                <div className="modal-header">
                    <h3>Информация о услугах</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Закрыть модальное окно">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="subscription-info">
                        <h4>Retargeting Trigger Leads</h4>
                        <p>Идентифицирует скрытых посетителей на конкретных страницах сайтов рекламодателя через лёгкий JS-код, фиксирующий geo, источник визита, устройство, время и поведение на страницах. Сопоставляет данные с Big Data Reffection и создаёт уникальный профиль пользователя. Определяет триггеры (поведенческие сигналы), которые показывают, насколько клиент готов к покупке — и возвращает его в воронку продаж.</p>
                    </div>
                    <div className="subscription-info">
                        <h4>Segment Scoring</h4>
                        <p>Собирает данные на сайтах в нише рекламодателя, анализируя цифровой след пользователей через Big Data, DMP Reffection и ML-модели телеком-операторов. Определяет вероятностный уровень вовлечённости и платёжеспособности клиента, учитывая геолокацию, поведение в сети, звонковую активность и контентное потребление.</p>
                    </div>
                    <div className="subscription-info">
                        <h4>Reactivation/Validation</h4>
                        <p>Дозванивается до 90% клиентов, используя технологии обхода спам-фильтров и адаптивную телефонию. Сценарии разговоров адаптированы под вашу нишу — операторы обучены продукту. Фильтрует, квалифицирует и возвращает до 50% потерянных лидов обратно в воронку продаж.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;