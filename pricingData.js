// Данные из Python калькулятора
const SUBSCRIPTIONS = {
    1: "Target_pricing",
    2: "Retargeting pricing",
    3: "Колл-центр"
};

const SERVICE1_PRICING = [
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
];

const SERVICE2_PRICING = [
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
];

const SERVICE3_PRICING = [
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
];

const TECH_PACKAGES = {
    "Стандарт": {"price": 14900, "discount": 0.0},
    "Премиум": {"price": 24900, "discount": 0.05},
    "Бизнес": {"price": 49900, "discount": 0.1},
    "Call": {"price": 4990, "discount": 0.0}
};

// To make them available globally in a browser context without modules,
// they are implicitly global or can be attached to window if needed,
// but const/let at the top level of a script are generally accessible
// to subsequent scripts.
// For explicit global attachment (less common for const/let):
// window.SUBSCRIPTIONS = SUBSCRIPTIONS;
// window.SERVICE1_PRICING = SERVICE1_PRICING;
// window.SERVICE2_PRICING = SERVICE2_PRICING;
// window.SERVICE3_PRICING = SERVICE3_PRICING;
// window.TECH_PACKAGES = TECH_PACKAGES;
