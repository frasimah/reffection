export const CONFIG = {
    SERVICES: {
        1: "Target_pricing",
        2: "Retargeting pricing",
        3: "Колл-центр"
    },
    SERVICE_PRICING: {
        1: [
            {contacts: 0, price_per_contact: 70},
            {contacts: 1000, price_per_contact: 60},
            {contacts: 3000, price_per_contact: 50},
            {contacts: 4000, price_per_contact: 45},
            {contacts: 5000, price_per_contact: 43},
            {contacts: 6000, price_per_contact: 40},
            {contacts: 7000, price_per_contact: 36},
            {contacts: 8000, price_per_contact: 34},
            {contacts: 9000, price_per_contact: 32},
            {contacts: 10000, price_per_contact: 30},
            {contacts: 13000, price_per_contact: 29},
            {contacts: 15000, price_per_contact: 28},
            {contacts: 20000, price_per_contact: 26},
            {contacts: 25000, price_per_contact: 25},
            {contacts: 30000, price_per_contact: 24},
            {contacts: 35000, price_per_contact: 23},
            {contacts: 40000, price_per_contact: 22},
            {contacts: 45000, price_per_contact: 21},
            {contacts: 50000, price_per_contact: 20}
        ],
        2: [
            {contacts: 0, price_per_contact: 50},
            {contacts: 1000, price_per_contact: 45},
            {contacts: 3000, price_per_contact: 40},
            {contacts: 4000, price_per_contact: 38},
            {contacts: 5000, price_per_contact: 36},
            {contacts: 6000, price_per_contact: 34},
            {contacts: 7000, price_per_contact: 32},
            {contacts: 8000, price_per_contact: 30},
            {contacts: 9000, price_per_contact: 28},
            {contacts: 10000, price_per_contact: 26},
            {contacts: 13000, price_per_contact: 25},
            {contacts: 15000, price_per_contact: 24},
            {contacts: 20000, price_per_contact: 22},
            {contacts: 25000, price_per_contact: 21},
            {contacts: 30000, price_per_contact: 20},
            {contacts: 35000, price_per_contact: 19},
            {contacts: 40000, price_per_contact: 18},
            {contacts: 45000, price_per_contact: 17},
            {contacts: 50000, price_per_contact: 16}
        ],
        3: [
            {contacts: 0, price_per_call: 50},
            {contacts: 1000, price_per_call: 45},
            {contacts: 3000, price_per_call: 40},
            {contacts: 4000, price_per_call: 35},
            {contacts: 5000, price_per_call: 34},
            {contacts: 6000, price_per_call: 33},
            {contacts: 7000, price_per_call: 32},
            {contacts: 8000, price_per_call: 31},
            {contacts: 9000, price_per_call: 30},
            {contacts: 10000, price_per_call: 29},
            {contacts: 13000, price_per_call: 28},
            {contacts: 15000, price_per_call: 27},
            {contacts: 20000, price_per_call: 26},
            {contacts: 25000, price_per_call: 25},
            {contacts: 30000, price_per_call: 24},
            {contacts: 35000, price_per_call: 23},
            {contacts: 40000, price_per_call: 22},
            {contacts: 45000, price_per_call: 21},
            {contacts: 50000, price_per_call: 20}
        ]
    },
    TECH_PACKAGES: {
        "Стандарт": {"price": 14900, "discount": 0.0},
        "Премиум": {"price": 24900, "discount": 0.05},
        "Бизнес": {"price": 49900, "discount": 0.1},
        "Call": {"price": 4990, "discount": 0.0}
    },
    SERVICE_OPTIONS: [
        { id: 1, name: "Segment_scoring" },
        { id: 2, name: "Retargeting Trigger Leads" },
        { id: 3, name: "Reactivation/Validation" }
    ],
    SUBSCRIPTION_OPTIONS: [
        { id: "tech", name: "Tech" },
        { id: "must", name: "Must" },
        { id: "pro", name: "Pro" },
        { id: "call", name: "Call" }
    ],
    SLIDER: {
        MIN: 1000,
        MAX: 50000,
        STEP: 100
    }
};