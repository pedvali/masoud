// Gaming Modern RTL Mini App JavaScript
const tg = window.Telegram.WebApp;
tg.expand();

let currentUser = null;
let appStarted = false;
let isAdmin = false;

// Admin IDs
const ADMIN_IDS = [1771570402];

// Initialize user data from Telegram
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    currentUser = tg.initDataUnsafe.user;
    isAdmin = ADMIN_IDS.includes(currentUser.id);
    
    // Update avatar in header
    const avatarImg = document.querySelector('.avatar-img');
    if (avatarImg && currentUser.photo_url) {
        avatarImg.src = currentUser.photo_url;
    }
    
    // Show admin elements for admin users
    if (isAdmin) {
        const adminBadge = document.getElementById('adminBadge');
        const adminAccessBtn = document.getElementById('adminAccessBtn');
        
        if (adminBadge) {
            adminBadge.style.display = 'flex';
        }
        
        if (adminAccessBtn) {
            adminAccessBtn.style.display = 'flex';
        }
        
        // Add admin card to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const adminCard = document.createElement('div');
            adminCard.className = 'game-card admin-card';
            adminCard.onclick = () => showPage('adminPage');
            adminCard.innerHTML = `
                <div class="card-content">
                    <div class="card-text">
                        <h3 class="card-title">👑 پنل مدیریت</h3>
                    </div>
                </div>
            `;
            
            // Insert admin card at the beginning
            mainContent.insertBefore(adminCard, mainContent.firstChild);
        }
    }
}

// Page navigation for new layout
function showPage(pageId) {
    // Handle haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Update navigation active state
    updateNavigation(pageId);
    
    // Handle different pages
    switch(pageId) {
        case 'mainPage':
            // Already on main page
            break;
        case 'profilePage':
            showProfilePage();
            break;
        case 'leaderboardPage':
            showLeaderboardPage();
            break;
        case 'tasksPage':
            showTasksPage();
            break;
        case 'invitePage':
            showInviteDialog();
            break;
        case 'winnersPage':
            showWinnersPage();
            break;
        case 'settingsPage':
            showSettingsPage();
            break;
        case 'adminPage':
            if (isAdmin) {
                showAdminPage();
            } else {
                tg.showAlert('شما دسترسی به این بخش را ندارید!');
            }
            break;
    }
}

// Update navigation active state
function updateNavigation(activePage) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[onclick="showPage('${activePage}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Show leaderboard page
function showLeaderboardPage() {
    createModal('🏆 لیدربورد', `
        <div class="leaderboard-modal">
            <div class="leaderboard-header">
                <div class="leaderboard-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3>برترین کاربران</h3>
                <p class="leaderboard-subtitle">رتبه‌بندی هفتگی</p>
            </div>
            <div class="leaderboard-list">
                <div class="leaderboard-item gold">
                    <div class="rank">1</div>
                    <div class="user-info">
                        <div class="user-name">علی رضایی</div>
                        <div class="user-score">۲۵,۴۳۰ امتیاز</div>
                    </div>
                    <div class="rank-icon">🥇</div>
                </div>
                <div class="leaderboard-item silver">
                    <div class="rank">2</div>
                    <div class="user-info">
                        <div class="user-name">مریم احمدی</div>
                        <div class="user-score">۲۲,۱۸۰ امتیاز</div>
                    </div>
                    <div class="rank-icon">🥈</div>
                </div>
                <div class="leaderboard-item bronze">
                    <div class="rank">3</div>
                    <div class="user-info">
                        <div class="user-name">رضا محمدی</div>
                        <div class="user-score">۱۹,۹۵۰ امتیاز</div>
                    </div>
                    <div class="rank-icon">🥉</div>
                </div>
                <div class="leaderboard-item">
                    <div class="rank">4</div>
                    <div class="user-info">
                        <div class="user-name">سارا حسینی</div>
                        <div class="user-score">۱۸,۲۰۰ امتیاز</div>
                    </div>
                </div>
                <div class="leaderboard-item">
                    <div class="rank">5</div>
                    <div class="user-info">
                        <div class="user-name">امیر حسینی</div>
                        <div class="user-score">۱۶,۷۵۰ امتیاز</div>
                    </div>
                </div>
            </div>
            <div class="leaderboard-footer">
                <p class="your-rank">رتبه شما: <span class="highlight">۱۲</span></p>
                <p class="your-score">امتیاز شما: <span class="highlight">۱۲,۵۰۰</span></p>
            </div>
        </div>
    `);
}

// Show tasks page
function showTasksPage() {
    createModal('📝 ماموریت‌ها', `
        <div class="tasks-modal">
            <div class="tasks-header">
                <div class="tasks-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <h3>ماموریت‌های فعال</h3>
                <p class="tasks-subtitle">ماموریت‌ها را انجام دهید و امتیاز بگیرید!</p>
            </div>
            <div class="tasks-list">
                <div class="task-item">
                    <div class="task-info">
                        <h4>دعوت از 3 دوست</h4>
                        <p>از 3 دوست خود به ربات دعوت کنید</p>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+50</span>
                        <button class="task-btn">انجام</button>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-info">
                        <h4>انجام 5 تسک روزانه</h4>
                        <p>5 تسک روزانه را کامل کنید</p>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+30</span>
                        <button class="task-btn">انجام</button>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-info">
                        <h4>شرکت در قرعه‌کشی هفتگی</h4>
                        <p>در قرعه‌کشی هفتگی شرکت کنید</p>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+20</span>
                        <button class="task-btn">انجام</button>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-info">
                        <h4>پیوستن به کانال تلگرام</h4>
                        <p>در کانال تلگرام ما عضو شوید</p>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+25</span>
                        <button class="task-btn">انجام</button>
                    </div>
                </div>
            </div>
            <div class="tasks-progress">
                <div class="progress-info">
                    <span>پیشرفت امروز</span>
                    <span>2/4</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 50%"></div>
                </div>
            </div>
        </div>
    `);
}

// Show winners page
function showWinnersPage() {
    createModal('🏆 برندگان', `
        <div class="winners-modal">
            <div class="winners-header">
                <div class="winners-icon">
                    <i class="fas fa-crown"></i>
                </div>
                <h3>برندگان اخیر</h3>
                <p class="winners-subtitle">تبریک به برندگان خوش‌شانس!</p>
            </div>
            <div class="winners-list">
                <div class="winner-item">
                    <div class="winner-date">۱۴ بهمن ۱۴۰۲</div>
                    <div class="winner-info">
                        <div class="winner-name">علی رضایی</div>
                        <div class="winner-prize">قرعه‌کشی هفتگی - ۱۰۰ میلیون تومان</div>
                    </div>
                    <div class="winner-badge">🎉</div>
                </div>
                <div class="winner-item">
                    <div class="winner-date">۷ بهمن ۱۴۰۲</div>
                    <div class="winner-info">
                        <div class="winner-name">مریم احمدی</div>
                        <div class="winner-prize">کاستوم روم - ۵۰۰۰ امتیاز</div>
                    </div>
                    <div class="winner-badge">🎮</div>
                </div>
                <div class="winner-item">
                    <div class="winner-date">۳۱ دی ۱۴۰۲</div>
                    <div class="winner-info">
                        <div class="winner-name">رضا محمدی</div>
                        <div class="winner-prize">قرعه‌کشی ماهانه - ۵۰۰ میلیون تومان</div>
                    </div>
                    <div class="winner-badge">💰</div>
                </div>
                <div class="winner-item">
                    <div class="winner-date">۲۴ دی ۱۴۰۲</div>
                    <div class="winner-info">
                        <div class="winner-name">سارا حسینی</div>
                        <div class="winner-prize">تورنمنت ویژه - گوشی آیفون</div>
                    </div>
                    <div class="winner-badge">📱</div>
                </div>
            </div>
            <div class="winners-footer">
                <p class="next-draw">قرعه‌کشی بعدی: جمعه ساعت ۲۱:۰۰</p>
                <button class="enter-lottery-btn">شرکت در قرعه‌کشی</button>
            </div>
        </div>
    `);
}

// Show settings page
function showSettingsPage() {
    createModal('⚙️ تنظیمات', `
        <div class="settings-modal">
            <div class="settings-header">
                <div class="settings-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <h3>تنظیمات برنامه</h3>
            </div>
            <div class="settings-list">
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>اعلان‌ها</h4>
                        <p>دریافت اعلان‌های مهم</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>لرزش هنگام کلیک</h4>
                        <p>بازخورد لرزشی در لمس</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>حالت شب</h4>
                        <p>تم تیره برای راحتی چشم</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>زبان برنامه</h4>
                        <p>انتخاب زبان نمایش</p>
                    </div>
                    <select class="setting-select">
                        <option>فارسی</option>
                        <option>English</option>
                    </select>
                </div>
            </div>
            <div class="settings-footer">
                <button class="save-settings-btn">ذخیره تنظیمات</button>
                <button class="reset-settings-btn">بازنشانی تنظیمات</button>
            </div>
        </div>
    `);
}

// Show profile page
function showProfilePage() {
    const adminStatus = isAdmin ? '<div class="admin-status">👑 ادمین</div>' : '';
    
    createModal('پروفایل کاربری', `
        <div class="profile-modal">
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="${currentUser?.photo_url || 'https://via.placeholder.com/80'}" alt="Profile" class="profile-avatar-img">
                </div>
                <div class="profile-info">
                    <h3>${currentUser?.first_name || 'کاربر گیمینو'}</h3>
                    <p>ID: ${currentUser?.id || '---'}</p>
                    ${adminStatus}
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
