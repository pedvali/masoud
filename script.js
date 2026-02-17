// Gameino Land - Interactive Gaming Mini App JavaScript
const tg = window.Telegram.WebApp;
tg.expand();

let currentUser = null;
let appStarted = false;
let isAdmin = false;
let isSpinning = false;

// Admin IDs
const ADMIN_IDS = [1771570402];

// Game state
let gameState = {
    level: 1,
    experience: 30,
    coins: 4750,
    diamonds: 15,
    rank: 12,
    dailySpinAvailable: true,
    missionsCompleted: [],
    friendsInvited: 0
};

// Initialize user data from Telegram
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    currentUser = tg.initDataUnsafe.user;
    isAdmin = ADMIN_IDS.includes(currentUser.id);
    
    // Update welcome message with user name
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.textContent = `Welcome, ${currentUser.first_name || 'Player'}!`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    updateUI();
});

function initializeGame() {
    console.log('🎮 Gameino Land initialized!');
    appStarted = true;
    
    // Load saved game state
    loadGameState();
    
    // Initialize Telegram Web App
    if (tg) {
        tg.ready();
        tg.setHeaderColor('#3498db');
        tg.setBackgroundColor('#87CEEB');
    }
}

function setupEventListeners() {
    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            handleNavigation(page);
        });
    });
    
    // Setup modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Setup modal overlay click to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
}

function handleNavigation(page) {
    // Handle haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Update navigation active state
    updateNavigation(page);
    
    // Handle different pages
    switch(page) {
        case 'mainPage':
            // Already on main page
            break;
        case 'invitePage':
            showInviteDialog();
            break;
        case 'winnersPage':
            showWinnersPage();
            break;
        default:
            tg.showAlert('این بخش به زودی فعال می‌شود!');
    }
}

function updateNavigation(activePage) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the correct nav item
    const activeItem = document.querySelector(`[onclick*="${activePage}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function updateUI() {
    // Update level and progress
    updateLevelProgress();
    
    // Update stats
    updateStats();
    
    // Update daily status
    updateDailyStatus();
}

function updateLevelProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${gameState.experience}%`;
    }
    
    const levelText = document.querySelector('.level-text');
    if (levelText) {
        levelText.textContent = `Level ${gameState.level}`;
    }
}

function updateStats() {
    // Update coins
    const coinsElement = document.querySelector('.user-stats .stat-item:first-child span');
    if (coinsElement) {
        coinsElement.textContent = gameState.coins.toLocaleString();
    }
    
    // Update rank
    const rankElement = document.querySelector('.user-stats .stat-item:last-child span');
    if (rankElement) {
        rankElement.textContent = `#${gameState.rank}`;
    }
    
    // Update diamonds
    const diamondElement = document.querySelector('.diamond-badge span');
    if (diamondElement) {
        diamondElement.textContent = gameState.diamonds;
    }
}

function updateDailyStatus() {
    const statusElement = document.querySelector('.status-badge span');
    if (statusElement) {
        statusElement.textContent = gameState.dailySpinAvailable ? 'وضعیت امروز: فعال' : 'وضعیت امروز: استفاده شده';
    }
    
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        if (!gameState.dailySpinAvailable) {
            statusBadge.style.opacity = '0.6';
        }
    }
}

// Spin Wheel Functions
function startSpinWheel() {
    if (!gameState.dailySpinAvailable) {
        tg.showAlert('شما امروز از چرخ شانس خود استفاده کرده‌اید! فردا دوباره تلاش کنید.');
        return;
    }
    
    if (isSpinning) {
        return;
    }
    
    // Show modal
    const modal = document.getElementById('spinWheelModal');
    if (modal) {
        modal.classList.add('show');
    }
    
    // Handle haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

function closeSpinWheel() {
    const modal = document.getElementById('spinWheelModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function spin() {
    if (isSpinning) {
        return;
    }
    
    isSpinning = true;
    
    const wheel = document.querySelector('.spin-wheel-large');
    const resultElement = document.getElementById('spinResult');
    const spinBtn = document.querySelector('.spin-btn');
    
    // Disable button
    spinBtn.disabled = true;
    spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال چرخاندن...';
    
    // Clear previous result
    resultElement.textContent = '';
    
    // Define prizes
    const prizes = [
        { name: '100 سکه', value: 100, type: 'coins', color: '#f1c40f' },
        { name: '50 سکه', value: 50, type: 'coins', color: '#f39c12' },
        { name: '1 الماس', value: 1, type: 'diamonds', color: '#9b59b6' },
        { name: '200 سکه', value: 200, type: 'coins', color: '#e67e22' },
        { name: '2 الماس', value: 2, type: 'diamonds', color: '#8e44ad' },
        { name: '500 سکه', value: 500, type: 'coins', color: '#e74c3c' }
    ];
    
    // Calculate random result
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];
    const rotationDegrees = 360 * 5 + (randomIndex * 60); // 5 full rotations + position
    
    // Apply rotation animation
    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${rotationDegrees}deg)`;
    
    // Show result after animation
    setTimeout(() => {
        // Update game state
        if (prize.type === 'coins') {
            gameState.coins += prize.value;
        } else if (prize.type === 'diamonds') {
            gameState.diamonds += prize.value;
        }
        
        // Mark daily spin as used
        gameState.dailySpinAvailable = false;
        
        // Show result
        resultElement.innerHTML = `
            <div style="color: ${prize.color}; font-size: 20px; margin-bottom: 10px;">
                <i class="fas fa-trophy"></i>
            </div>
            <div>تبریک! شما برنده ${prize.name} شدید!</div>
        `;
        
        // Update UI
        updateUI();
        saveGameState();
        
        // Reset button
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<i class="fas fa-redo"></i> چرخاندن دوباره';
        isSpinning = false;
        
        // Handle haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
        // Show success message
        if (tg) {
            tg.showAlert(`🎉恭喜! شما برنده ${prize.name} شدید!`);
        }
        
    }, 4000);
}

// Missions Functions
function showMissions() {
    const missions = [
        { id: 1, title: 'چرخ شانس اول', description: 'چرخ شانس را بچرخانید', reward: 50, completed: gameState.dailySpinAvailable === false },
        { id: 2, title: 'دعوت دوست', description: 'یک دوست را دعوت کنید', reward: 100, completed: gameState.friendsInvited > 0 },
        { id: 3, title: 'جمع آوری سکه', description: '1000 سکه جمع کنید', reward: 200, completed: gameState.coins >= 1000 },
        { id: 4, title: 'ارتقاء سطح', description: 'به سطح 2 برسید', reward: 500, completed: gameState.level >= 2 }
    ];
    
    let missionsHTML = `
        <div style="text-align: center;">
            <h3 style="color: #f1c40f; margin-bottom: 20px;">ماموریت‌ها</h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
    `;
    
    missions.forEach(mission => {
        const statusIcon = mission.completed ? 
            '<i class="fas fa-check-circle" style="color: #2ecc71;"></i>' : 
            '<i class="fas fa-circle" style="color: #95a5a6;"></i>';
        
        missionsHTML += `
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: #ffffff; margin-bottom: 5px;">${statusIcon} ${mission.title}</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">${mission.description}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #f1c40f; font-weight: 700;">+${mission.reward}</div>
                        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.7);">سکه</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    missionsHTML += `
            </div>
            <button onclick="closeModal()" style="margin-top: 20px; background: linear-gradient(135deg, #e67e22, #d35400); border: none; border-radius: 10px; padding: 12px 24px; color: white; font-weight: 700; cursor: pointer;">
                بستن
            </button>
        </div>
    `;
    
    showModal('ماموریت‌ها', missionsHTML);
}

// Invite Functions
function showInviteDialog() {
    const inviteLink = `https://t.me/gameino_land_bot?start=${currentUser?.id || 'guest'}`;
    
    const inviteHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">
                <i class="fas fa-users" style="font-size: 48px; color: #f1c40f;"></i>
            </div>
            <h3 style="color: #f1c40f; margin-bottom: 15px;">دعوت از دوستان</h3>
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
                دوستان خود را دعوت کنید و جایزه بگیرید!
            </p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin-bottom: 5px;">لینک دعوت شما:</div>
                <div style="word-break: break-all; color: #ffffff; font-family: monospace; font-size: 12px;">${inviteLink}</div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="copyInviteLink('${inviteLink}')" style="background: linear-gradient(135deg, #3498db, #2980b9); border: none; border-radius: 10px; padding: 12px 20px; color: white; font-weight: 700; cursor: pointer;">
                    <i class="fas fa-copy"></i> کپی لینک
                </button>
                <button onclick="shareInviteLink('${inviteLink}')" style="background: linear-gradient(135deg, #2ecc71, #27ae60); border: none; border-radius: 10px; padding: 12px 20px; color: white; font-weight: 700; cursor: pointer;">
                    <i class="fas fa-share"></i> اشتراک‌گذاری
                </button>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: rgba(241, 196, 15, 0.1); border-radius: 10px; border: 1px solid rgba(241, 196, 15, 0.3);">
                <div style="color: #f1c40f; font-weight: 700; margin-bottom: 5px;">جایزه‌ها:</div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8);">
                    • به ازای هر دوست: 100 سکه<br>
                    • به ازای هر 5 دوست: 1 الماس<br>
                    • به ازای هر 10 دوست: 500 سکه
                </div>
            </div>
        </div>
    `;
    
    showModal('دعوت از دوستان', inviteHTML);
}

function copyInviteLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        tg.showAlert('لینک با موفقیت کپی شد!');
        
        // Handle haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }).catch(() => {
        tg.showAlert('خطا در کپی لینک!');
    });
}

function shareInviteLink(link) {
    if (tg.shareURL) {
        tg.shareURL(link, 'به گیمینو لند بپیوندید و جایزه بگیرید!');
    } else {
        tg.showAlert('اشتراک‌گذاری در دسترس نیست!');
    }
}

// Winners Page
function showWinnersPage() {
    const winners = [
        { name: 'Ali', prize: '1,000,000 تومان', time: '2 دقیقه پیش', avatar: '👤' },
        { name: 'Sara', prize: '500,000 تومان', time: '5 دقیقه پیش', avatar: '👩' },
        { name: 'Reza', prize: '750,000 تومان', time: '10 دقیقه پیش', avatar: '👨' },
        { name: 'Maryam', prize: '2,000,000 تومان', time: '15 دقیقه پیش', avatar: '👩‍💼' },
        { name: 'Hamed', prize: '300,000 تومان', time: '20 دقیقه پیش', avatar: '👨‍💼' }
    ];
    
    let winnersHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">
                <i class="fas fa-trophy" style="font-size: 48px; color: #f1c40f;"></i>
            </div>
            <h3 style="color: #f1c40f; margin-bottom: 20px;">برندگان اخیر</h3>
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto;">
    `;
    
    winners.forEach((winner, index) => {
        winnersHTML += `
            <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 24px;">${winner.avatar}</div>
                <div style="flex: 1; text-align: right;">
                    <div style="font-weight: 700; color: #ffffff;">${winner.name}</div>
                    <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">${winner.time}</div>
                </div>
                <div style="color: #2ecc71; font-weight: 700;">${winner.prize}</div>
            </div>
        `;
    });
    
    winnersHTML += `
            </div>
            <button onclick="closeModal()" style="margin-top: 20px; background: linear-gradient(135deg, #e67e22, #d35400); border: none; border-radius: 10px; padding: 12px 24px; color: white; font-weight: 700; cursor: pointer;">
                بستن
            </button>
        </div>
    `;
    
    showModal('برندگان', winnersHTML);
}

// Modal Functions
function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('genericModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'genericModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle"></h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" id="modalContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Set content
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    
    // Show modal
    modal.classList.add('show');
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Game State Management
function saveGameState() {
    const stateToSave = {
        ...gameState,
        lastSaved: new Date().toISOString()
    };
    
    if (tg.CloudStorage) {
        tg.CloudStorage.setItem('gameState', JSON.stringify(stateToSave));
    } else {
        localStorage.setItem('gameinoGameState', JSON.stringify(stateToSave));
    }
}

function loadGameState() {
    const loadState = (stateStr) => {
        try {
            const savedState = JSON.parse(stateStr);
            if (savedState && savedState.lastSaved) {
                // Check if it's a new day
                const lastSaved = new Date(savedState.lastSaved);
                const now = new Date();
                const isDifferentDay = lastSaved.toDateString() !== now.toDateString();
                
                if (isDifferentDay) {
                    // Reset daily spin
                    savedState.dailySpinAvailable = true;
                }
                
                // Merge saved state with current state
                gameState = { ...gameState, ...savedState };
                return true;
            }
        } catch (e) {
            console.error('Error loading game state:', e);
        }
        return false;
    };
    
    if (tg.CloudStorage) {
        tg.CloudStorage.getItem('gameState', (error, result) => {
            if (!error && result) {
                loadState(result);
                updateUI();
            }
        });
    } else {
        const savedState = localStorage.getItem('gameinoGameState');
        if (savedState) {
            if (loadState(savedState)) {
                updateUI();
            }
        }
    }
}

// Utility Functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, 16);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Gameino Land Error:', e.error);
});

// Export functions for global access
// New functions for updated UI
function showProfilePage() {
    const profileHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">
                <i class="fas fa-user-circle" style="font-size: 64px; color: #f1c40f;"></i>
            </div>
            <h3 style="color: #f1c40f; margin-bottom: 15px;">پروفایل کاربری</h3>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div style="text-align: right; margin-bottom: 10px;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 5px;">نام: ${currentUser?.first_name || 'Player'}</div>
                    <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">ID: ${currentUser?.id || '---'}</div>
                </div>
                <div style="display: flex; justify-content: space-around; text-align: center;">
                    <div>
                        <div style="color: #f1c40f; font-weight: 700; font-size: 18px;">${gameState.missionsCompleted.length}</div>
                        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.7);">تسک‌های انجام شده</div>
                    </div>
                    <div>
                        <div style="color: #2ecc71; font-weight: 700; font-size: 18px;">3</div>
                        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.7);">جوایز برنده شده</div>
                    </div>
                </div>
            </div>
            <button onclick="closeModal()" style="background: linear-gradient(135deg, #e67e22, #d35400); border: none; border-radius: 10px; padding: 12px 24px; color: white; font-weight: 700; cursor: pointer;">
                بستن
            </button>
        </div>
    `;
    
    showModal('پروفایل', profileHTML);
}

function showWeeklyLottery() {
    const lotteryHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">
                <i class="fas fa-gift" style="font-size: 48px; color: #f1c40f;"></i>
            </div>
            <h3 style="color: #f1c40f; margin-bottom: 15px;">قرعه کشی هفتگی</h3>
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
                هر هفته به 10 نفر برنده جایزه ویژه!
            </p>
            <div style="background: rgba(241, 196, 15, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(241, 196, 15, 0.3);">
                <div style="color: #f1c40f; font-weight: 700; margin-bottom: 10px;">جایزه‌ها:</div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8); text-align: right;">
                    • جایزه اول: 1,000,000 تومان<br>
                    • جایزه دوم: 500,000 تومان<br>
                    • 8 جایزه 100,000 تومانی
                </div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin-bottom: 5px;">زمان باقی‌مانده:</div>
                <div style="color: #ffffff; font-weight: 700;">2 روز و 14 ساعت</div>
            </div>
            <button onclick="closeModal()" style="background: linear-gradient(135deg, #e67e22, #d35400); border: none; border-radius: 10px; padding: 12px 24px; color: white; font-weight: 700; cursor: pointer;">
                شرکت در قرعه کشی
            </button>
        </div>
    `;
    
    showModal('قرعه کشی هفتگی', lotteryHTML);
}

function showMonthlyLottery() {
    const lotteryHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">
                <i class="fas fa-calendar-alt" style="font-size: 48px; color: #e74c3c;"></i>
            </div>
            <h3 style="color: #e74c3c; margin-bottom: 15px;">قرعه کشی ماهانه</h3>
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
                جایزه بزرگ ماهانه برای یک نفر خوش‌شانس!
            </p>
            <div style="background: rgba(231, 76, 60, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(231, 76, 60, 0.3);">
                <div style="color: #e74c3c; font-weight: 700; margin-bottom: 10px; font-size: 20px;">جایزه بزرگ: 10,000,000 تومان!</div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8);">
                    به یک نفر برنده ماهانه
                </div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin-bottom: 5px;">زمان باقی‌مانده:</div>
                <div style="color: #ffffff; font-weight: 700;">18 روز و 14 ساعت</div>
            </div>
            <button onclick="closeModal()" style="background: linear-gradient(135deg, #e74c3c, #c0392b); border: none; border-radius: 10px; padding: 12px 24px; color: white; font-weight: 700; cursor: pointer;">
                شرکت در قرعه کشی
            </button>
        </div>
    `;
    
    showModal('قرعه کشی ماهانه', lotteryHTML);
}

function enterChallenge() {
    const challengeHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">
                <i class="fas fa-gamepad" style="font-size: 48px; color: #27ae60;"></i>
            </div>
            <h3 style="color: #27ae60; margin-bottom: 15px;">ورود به چالش اختصاصی</h3>
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
                کد چالش خود را وارد کنید:
            </p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <input type="text" placeholder="کد چالش را وارد کنید" style="width: 100%; padding: 10px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 5px; color: white; text-align: center; font-size: 16px;">
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="closeModal()" style="background: linear-gradient(135deg, #27ae60, #229954); border: none; border-radius: 10px; padding: 12px 20px; color: white; font-weight: 700; cursor: pointer;">
                    ورود به چالش
                </button>
                <button onclick="closeModal()" style="background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 10px; padding: 12px 20px; color: white; font-weight: 700; cursor: pointer;">
                    انصراف
                </button>
            </div>
        </div>
    `;
    
    showModal('چالش اختصاصی', challengeHTML);
}

window.startSpinWheel = startSpinWheel;
window.closeSpinWheel = closeSpinWheel;
window.spin = spin;
window.showMissions = showMissions;
window.showInviteDialog = showInviteDialog;
window.copyInviteLink = copyInviteLink;
window.shareInviteLink = shareInviteLink;
window.showWinnersPage = showWinnersPage;
window.closeModal = closeModal;
window.showPage = handleNavigation;
window.showProfilePage = showProfilePage;
window.showWeeklyLottery = showWeeklyLottery;
window.showMonthlyLottery = showMonthlyLottery;
window.enterChallenge = enterChallenge;
    
    const activeButton = document.querySelector(`[onclick="showPage('${activePage}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Show profile page
function showProfilePage() {
    createModal('پروفایل کاربری', `
        <div class="profile-modal">
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="${currentUser?.photo_url || 'https://via.placeholder.com/80'}" alt="Profile" class="profile-avatar-img">
                </div>
                <div class="profile-info">
                    <h3>${currentUser?.first_name || 'کاربر گیمینو'}</h3>
                    <p>ID: ${currentUser?.id || '---'}</p>
                </div>
            </div>
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-value">۱۲,۵۰۰</span>
                    <span class="stat-label">امتیاز کل</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">۱۵</span>
                    <span class="stat-label">تسک‌های انجام شده</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">۲</span>
                    <span class="stat-label">جوایز برنده شده</span>
                </div>
            </div>
        </div>
    `);
}

// Show invite dialog
function showInviteDialog() {
    const inviteLink = `https://t.me/gaminoland_bot?start=${currentUser?.id || 'user'}`;
    
    if (tg.shareURL) {
        tg.shareURL(inviteLink, 'به گیمینو لند بپیوندید و برنده جوایز بزرگ شوید!');
    } else {
        createModal('دعوت دوستان', `
            <div class="invite-modal">
                <p>لینک دعوت شما:</p>
                <div class="invite-link-container">
                    <input type="text" value="${inviteLink}" readonly class="invite-link">
                    <button onclick="copyInviteLink('${inviteLink}')" class="copy-btn">کپی</button>
                </div>
                <p class="invite-info">با دعوت دوستان خود امتیاز بگیرید!</p>
            </div>
        `);
    }
}

// Copy invite link
function copyInviteLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        tg.showAlert('لینک با موفقیت کپی شد!');
    });
}

// Enter lottery
function enterLottery(type) {
    const prize = type === 'weekly' ? '۱۰۰ میلیون تومان' : 'جایزه بزرگ فصل';
    const time = type === 'weekly' ? 'جمعه ساعت ۲۱:۰۰' : 'اول هر ماه';
    
    createModal(`قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'}`, `
        <div class="lottery-modal">
            <div class="lottery-icon">
                <i class="fas fa-${type === 'weekly' ? 'gift' : 'crown'}"></i>
            </div>
            <h3>قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'}</h3>
            <p class="lottery-time">${time}</p>
            <p class="lottery-prize">جایزه: ${prize}</p>
            <button onclick="confirmLotteryEntry('${type}')" class="confirm-btn">ثبت نام در قرعه‌کشی</button>
        </div>
    `);
}

// Confirm lottery entry
function confirmLotteryEntry(type) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    
    tg.showAlert(`شما با موفقیت در قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'} ثبت نام کردید!`);
    closeModal();
}

// Enter custom room
function enterCustomRoom() {
    createModal('کاستوم روم', `
        <div class="custom-room-modal">
            <div class="room-icon">
                <i class="fas fa-dice-d20"></i>
            </div>
            <h3>کاستوم روم</h3>
            <p>اتاق‌های اختصاصی برای مسابقات ویژه</p>
            <div class="room-options">
                <button onclick="joinRoom('public')" class="room-btn">ورود به روم عمومی</button>
                <button onclick="createPrivateRoom()" class="room-btn">ایجاد روم خصوصی</button>
            </div>
        </div>
    `);
}

// Join room
function joinRoom(type) {
    tg.showAlert(`در حال اتصال به روم ${type === 'public' ? 'عمومی' : 'خصوصی'}...`);
    closeModal();
}

// Create private room
function createPrivateRoom() {
    tg.showAlert('ایجاد روم خصوصی به زودی فعال می‌شود!');
    closeModal();
}

// Show admin page
function showAdminPage() {
    createModal('پنل مدیریت', `
        <div class="admin-modal">
            <h3>👑 پنل مدیریت گیمینو لند</h3>
            <div class="admin-grid">
                <button onclick="adminTaskManager()" class="admin-btn">
                    <i class="fas fa-tasks"></i>
                    <span>مدیریت تسک‌ها</span>
                </button>
                <button onclick="adminReferralSystem()" class="admin-btn">
                    <i class="fas fa-users"></i>
                    <span>سیستم رفرال</span>
                </button>
                <button onclick="adminCustomRooms()" class="admin-btn">
                    <i class="fas fa-door-open"></i>
                    <span>کاستوم روم‌ها</span>
                </button>
                <button onclick="adminLotteries()" class="admin-btn">
                    <i class="fas fa-dice"></i>
                    <span>قرعه‌کشی‌ها</span>
                </button>
            </div>
        </div>
    `);
}

// Admin functions
function adminTaskManager() {
    tg.showAlert('مدیریت تسک‌ها به زودی فعال می‌شود!');
}

function adminReferralSystem() {
    tg.showAlert('مدیریت رفرال به زودی فعال می‌شود!');
}

function adminCustomRooms() {
    tg.showAlert('مدیریت روم‌ها به زودی فعال می‌شود!');
}

function adminLotteries() {
    tg.showAlert('مدیریت قرعه‌کشی‌ها به زودی فعال می‌شود!');
}

// Modal functions
function createModal(title, content) {
    // Remove existing modal
    closeModal();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button onclick="closeModal()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Close modal on background click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add loading states
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animations
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize Telegram Web App
    if (tg) {
        tg.ready();
        tg.expand();
        
        // Set theme colors
        tg.setHeaderColor('#0f172a');
        tg.setBackgroundColor('#0f172a');
    }
});

// Add card click effects
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    });
});

// Add navigation click effects
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});
