

# Определение типов услуг
SUBSCRIPTIONS = {
    1: "Target_pricing",
    2: "Retargeting pricing",
    3: "Колл-центр",
    4: "Пакет TECH (обязательная ежемесячная абонентская плата)"
}

# Тарифы для услуги 1: Segment_scoring
SERVICE1_PRICING = [
    {"contacts": 0, "price_per_contact": 70},
    {"contacts": 1000, "price_per_contact": 60},
    {"contacts": 3000, "price_per_contact": 50},
    {"contacts": 4000, "price_per_contact": 45},
    {"contacts": 5000, "price_per_contact": 43},
    {"contacts": 6000, "price_per_contact": 40},
    {"contacts": 7000, "price_per_contact": 36},
    {"contacts": 8000, "price_per_contact": 34},
    {"contacts": 9000, "price_per_contact": 32},
    {"contacts": 10000, "price_per_contact": 30},
    {"contacts": 13000, "price_per_contact": 29},
    {"contacts": 15000, "price_per_contact": 28},
    {"contacts": 20000, "price_per_contact": 26},
    {"contacts": 25000, "price_per_contact": 25},
    {"contacts": 30000, "price_per_contact": 24},
    {"contacts": 35000, "price_per_contact": 23},
    {"contacts": 40000, "price_per_contact": 22},
    {"contacts": 45000, "price_per_contact": 21},
    {"contacts": 50000, "price_per_contact": 20}
]

# Тарифы для услуги 2: Retargeting Trigger Leads
SERVICE2_PRICING = [
    {"contacts": 0, "price_per_contact": 100},
    {"contacts": 1000, "price_per_contact": 90},
    {"contacts": 3000, "price_per_contact": 77},
    {"contacts": 4000, "price_per_contact": 60},
    {"contacts": 5000, "price_per_contact": 53},
    {"contacts": 6000, "price_per_contact": 52},
    {"contacts": 7000, "price_per_contact": 51},
    {"contacts": 8000, "price_per_contact": 50},
    {"contacts": 9000, "price_per_contact": 49},
    {"contacts": 10000, "price_per_contact": 48},
    {"contacts": 13000, "price_per_contact": 47},
    {"contacts": 15000, "price_per_contact": 46},
    {"contacts": 20000, "price_per_contact": 45},
    {"contacts": 25000, "price_per_contact": 44},
    {"contacts": 30000, "price_per_contact": 43},
    {"contacts": 35000, "price_per_contact": 42},
    {"contacts": 40000, "price_per_contact": 41},
    {"contacts": 45000, "price_per_contact": 40},
    {"contacts": 50000, "price_per_contact": 39}
]


# Тарифы для услуги 3: Reactivation/Validation
SERVICE3_PRICING = [
    {"contacts": 0, "price_per_call": 50},
    {"contacts": 1000, "price_per_call": 45},
    {"contacts": 3000, "price_per_call": 40},
    {"contacts": 4000, "price_per_call": 35},
    {"contacts": 5000, "price_per_call": 34},
    {"contacts": 6000, "price_per_call": 33},
    {"contacts": 7000, "price_per_call": 32},
    {"contacts": 8000, "price_per_call": 31},
    {"contacts": 9000, "price_per_call": 30},
    {"contacts": 10000, "price_per_call": 29},
    {"contacts": 13000, "price_per_call": 28},
    {"contacts": 15000, "price_per_call": 27},
    {"contacts": 20000, "price_per_call": 26},
    {"contacts": 25000, "price_per_call": 25},
    {"contacts": 30000, "price_per_call": 24},
    {"contacts": 35000, "price_per_call": 23},
    {"contacts": 40000, "price_per_call": 22},
    {"contacts": 45000, "price_per_call": 21},
    {"contacts": 50000, "price_per_call": 20}
]

# Тарифы пакета TECH (обязательная ежемесячная абонентская плата)
TECH_PACKAGES = {
    1: {"name": "Стандарт", "price": 4990},
    2: {"name": "Must", "price": 9900},
    3: {"name": "Pro", "price": 14900}
}

def calculate_cost_by_tiers(num_items, pricing_tiers, item_key, price_key):
    cost_per_item = 0
    total_cost = 0
    for i, tier in enumerate(pricing_tiers):
        if i == len(pricing_tiers) - 1 or num_items < pricing_tiers[i+1][item_key]:
            cost_per_item = tier[price_key]
            total_cost = num_items * cost_per_item
            break
    return total_cost, cost_per_item

def get_conversion_rate(average_check):
    """
    Определяет процент конверсии на основе среднего чека
    
    Параметры:
    average_check (int): Средний чек
    
    Возвращает:
    float: Процент конверсии в виде десятичной дроби
    """
    if average_check < 100000:
        return 0.03  # 3%
    elif 100000 <= average_check < 3000000:
        return 0.02  # 2%
    else:  # >= 3000000
        return 0.005  # 0.5%

def get_service_price(service_type, num_users, tech_package_type=1, average_check=0):
    """
    Рассчитывает стоимость услуги в зависимости от типа услуги, количества пользователей, выбранного тарифа TECH и среднего чека
    
    Параметры:
    service_type (int): Тип услуги (1, 2 или 3)
    num_users (int): Количество пользователей/контактов
    tech_package_type (int): Тип тарифа TECH (1 - Стандарт, 2 - Must, 3 - Pro)
    average_check (int): Средний чек для расчета конверсии
    
    Возвращает:
    dict: Словарь с результатами расчета
    """
    total_cost = 0
    cost_per_user = 0
    contact_processing_cost = 0
    
    if service_type == 1:
        # Услуга 1: Target_pricing
        total_cost, cost_per_user = calculate_cost_by_tiers(num_users, SERVICE1_PRICING, "contacts", "price_per_contact")
        # Добавляем стоимость обработки контактов (третья услуга)
        contact_processing_cost, _ = calculate_cost_by_tiers(num_users, SERVICE3_PRICING, "contacts", "price_per_call")
    
    elif service_type == 2:
        # Услуга 2: Retargeting pricing
        total_cost, cost_per_user = calculate_cost_by_tiers(num_users, SERVICE2_PRICING, "contacts", "price_per_contact")
        # Добавляем стоимость обработки контактов (третья услуга)
        contact_processing_cost, _ = calculate_cost_by_tiers(num_users, SERVICE3_PRICING, "contacts", "price_per_call")
    
    elif service_type == 3:
        # Услуга 3: Колл-центр
        total_cost, cost_per_user = calculate_cost_by_tiers(num_users, SERVICE3_PRICING, "contacts", "price_per_call")

    else:
        return {"error": "Неверный тип услуги. Доступные типы: 1, 2, 3"}
    
    # Получаем выбранный тариф TECH
    if tech_package_type not in TECH_PACKAGES:
        return {"error": "Неверный тип тарифа TECH. Доступные типы: 1, 2, 3"}
    
    tech_package = TECH_PACKAGES[tech_package_type]
    tech_package_cost = tech_package["price"]
    
    # Общая стоимость услуги с обработкой контактов
    total_service_cost = total_cost + contact_processing_cost
    
    # Добавляем стоимость выбранного пакета TECH
    total_cost_with_package = total_service_cost + tech_package_cost
    
    # Стоимость контакта с учетом подписки (округление до 1 рубля)
    contact_cost_with_subscription = round((total_cost_with_package) / num_users) if num_users > 0 else 0
    
    # Расчет конверсий
    conversion_rate = get_conversion_rate(average_check)
    expected_conversions = int(num_users * conversion_rate)
    cost_per_conversion = total_cost_with_package / expected_conversions if expected_conversions > 0 else 0
    
    result = {
        "service_type": SUBSCRIPTIONS.get(service_type, "Неизвестная услуга"),
        "num_users": num_users,
        "cost_per_user": cost_per_user,
        "total_service_cost": total_service_cost,
        "contact_processing_cost": contact_processing_cost,
        "tech_package_type": tech_package["name"],
        "tech_package_cost": tech_package_cost,
        "total_cost_with_package": total_cost_with_package,
        "contact_cost_with_subscription": contact_cost_with_subscription,
        "expected_conversions": expected_conversions,
        "cost_per_conversion": round(cost_per_conversion, 2)
    }
    
    return result

def main():
    """
    Основная функция для взаимодействия с пользователем
    """
    print("Калькулятор стоимости услуг Reffection")
    print("--------------------------------------")
    print("Доступные типы услуг:")
    for key, value in SUBSCRIPTIONS.items():
        if key in [1, 2, 3]:
            print(f"{key}. {value}")
    
    try:
        service_type = int(input("\nВыберите тип услуги (1-3): "))
        if service_type not in [1, 2, 3]:
            print("Ошибка: Выберите тип услуги от 1 до 3")
            return
        
        num_users_prompt = "Введите количество пользователей: "
        if service_type == 3:
            num_users_prompt = "Введите количество обработанных лидов: "

        num_users = int(input(num_users_prompt))
        if num_users <= 0:
            print("Ошибка: Количество должно быть положительным числом")
            return
        
        # Запрос среднего чека
        average_check = int(input("Введите средний чек: "))
        if average_check <= 0:
            print("Ошибка: Средний чек должен быть положительным числом")
            return
        
        print("\nВыберите тариф пакета TECH:")
        for key, package in TECH_PACKAGES.items():
            print(f"{key}. {package['name']} - {package['price']} руб./месяц")
        
        tech_package_type = int(input("Выберите тариф TECH (1-3): "))
        if tech_package_type not in [1, 2, 3]:
            print("Ошибка: Выберите тариф TECH от 1 до 3")
            return
        
        result = get_service_price(service_type, num_users, tech_package_type, average_check)
        
        if "error" in result:
            print(f"Ошибка: {result['error']}")
            return
        
        print("\nРезультаты расчета:")
        print(f"Общая стоимость услуги: {result['total_service_cost']} руб.")
        
        print(f"Тип услуги: {result['service_type']}")
        if service_type == 3:
            print(f"Количество обработанных лидов: {result['num_users']}")
            print(f"Стоимость данных: {result['cost_per_user']} руб.")
        else:
            print(f"Количество пользователей/контактов: {result['num_users']}")
            print(f"Стоимость данных: {result['cost_per_user']} руб.")
            print(f"\nОбработка контактов: {result['contact_processing_cost']} руб.")
        
        print(f"Выбранный тариф TECH: {result['tech_package_type']} - {result['tech_package_cost']} руб./месяц")
        print(f"Итоговая стоимость с учетом пакета: {result['total_cost_with_package']} руб.")
        print(f"Стоимость контакта: {result['contact_cost_with_subscription']} руб.")
        
        print(f"Ожидаемое количество конверсий: {result['expected_conversions']}")
        print(f"Ожидаемая стоимость конверсии: {result['cost_per_conversion']} руб.")
        
    except ValueError:
        print("Ошибка: Введите корректные числовые значения")
    except Exception as e:
        print(f"Произошла ошибка: {str(e)}")

if __name__ == "__main__":
    main()
