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
                        <div class="task-progress">
                            <div class="progress-info">
                                <span>پیشرفت: 1/3</span>
                                <span>33%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 33%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+50</span>
                        <button onclick="performTask('invite', 1, 3)" class="task-btn">ادامه</button>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-info">
                        <h4>انجام 5 تسک روزانه</h4>
                        <p>5 تسک روزانه را کامل کنید</p>
                        <div class="task-progress">
                            <div class="progress-info">
                                <span>پیشرفت: 3/5</span>
                                <span>60%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 60%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+30</span>
                        <button onclick="performTask('daily', 3, 5)" class="task-btn">ادامه</button>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-info">
                        <h4>پیوستن به کانال تلگرام</h4>
                        <p>در کانال رسمی گیمینو عضو شوید</p>
                        <div class="task-progress">
                            <div class="progress-info">
                                <span>وضعیت: انجام نشده</span>
                                <span>0%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+25</span>
                        <button onclick="performTask('channel', 0, 1)" class="task-btn">انجام</button>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-info">
                        <h4>شرکت در قرعه‌کشی هفتگی</h4>
                        <p>در قرعه‌کشی این هفته شرکت کنید</p>
                        <div class="task-progress">
                            <div class="progress-info">
                                <span>وضعیت: انجام شده</span>
                                <span>100%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="task-reward">
                        <span class="task-points">+20</span>
                        <button class="task-btn completed">✓ انجام شد</button>
                    </div>
                </div>
            </div>
            <div class="tasks-progress">
                <div class="progress-info">
                    <span>کل پیشرفت شما</span>
                    <span>4/8 تسک</span>
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
            <div class="active-lotteries">
                <h4>قرعه‌کشی‌های فعال</h4>
                <div class="lottery-item">
                    <div class="lottery-info">
                        <h5>قرعه‌کشی هفتگی</h5>
                        <p>جایزه: ۱۰۰ میلیون تومان</p>
                        <p>زمان: جمعه ۲۱:۰۰</p>
                        <div class="lottery-status">
                            <span class="status-badge active">شرکت باز است</span>
                            <span class="participants">1,234 نفر شرکت کرده‌اند</span>
                        </div>
                    </div>
                    <button onclick="joinLottery('weekly')" class="join-lottery-btn">شرکت کن</button>
                </div>
                <div class="lottery-item">
                    <div class="lottery-info">
                        <h5>قرعه‌کشی ماهانه</h5>
                        <p>جایزه: ۵۰۰ میلیون تومان</p>
                        <p>زمان: ۱ اسفند ۲۰:۰۰</p>
                        <div class="lottery-status">
                            <span class="status-badge active">شرکت باز است</span>
                            <span class="participants">2,456 نفر شرکت کرده‌اند</span>
                        </div>
                    </div>
                    <button onclick="joinLottery('monthly')" class="join-lottery-btn">شرکت کن</button>
                </div>
            </div>
            <div class="winners-footer">
                <p class="next-draw">قرعه‌کشی بعدی: جمعه ساعت ۲۱:۰۰</p>
                <button onclick="viewLotteryHistory()" class="view-history-btn">مشاهده تاریخچه</button>
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
                <h3>تنظیمات حساب کاربری</h3>
            </div>
            
            <div class="user-profile-section">
                <div class="profile-summary">
                    <div class="profile-avatar">
                        <img src="${currentUser?.photo_url || 'https://via.placeholder.com/60'}" alt="Profile">
                    </div>
                    <div class="profile-details">
                        <h4>${currentUser?.first_name || 'کاربر گیمینو'}</h4>
                        <p>ID: ${currentUser?.id || '---'}</p>
                        <p>امتیاز کل: <span class="points-highlight">12,500</span></p>
                    </div>
                </div>
            </div>
            
            <div class="settings-list">
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>اعلان‌ها</h4>
                        <p>دریافت اعلان‌های مهم و قرعه‌کشی‌ها</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked onchange="toggleSetting('notifications', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>لرزش هنگام کلیک</h4>
                        <p>بازخورد لرزشی در لمس دکمه‌ها</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked onchange="toggleSetting('haptic', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>حالت شب</h4>
                        <p>تم تیره برای راحتی چشم</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" onchange="toggleSetting('darkMode', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>زبان برنامه</h4>
                        <p>انتخاب زبان نمایش</p>
                    </div>
                    <select class="setting-select" onchange="changeLanguage(this.value)">
                        <option value="fa" selected>فارسی</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>قوانین و مقررات</h4>
                        <p>مشاهده قوانین استفاده از برنامه</p>
                    </div>
                    <button onclick="showRules()" class="setting-action-btn">مشاهده</button>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>پشتیبانی</h4>
                        <p>ارتباط با تیم پشتیبانی</p>
                    </div>
                    <button onclick="contactSupport()" class="setting-action-btn">تماس</button>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>خروج از حساب</h4>
                        <p>خروج از حساب کاربری</p>
                    </div>
                    <button onclick="logout()" class="setting-action-btn danger">خروج</button>
                </div>
            </div>
            
            <div class="settings-footer">
                <button onclick="saveSettings()" class="save-settings-btn">ذخیره تنظیمات</button>
                <button onclick="resetSettings()" class="reset-settings-btn">بازنشانی تنظیمات</button>
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
    createModal('🎮 کاستوم روم کالاف موبایل', `
        <div class="custom-room-modal">
            <div class="room-icon">
                <i class="fas fa-dice-d20"></i>
            </div>
            <h3>کاستوم روم‌های فعال</h3>
            <p>اتاق‌های اختصاصی برای مسابقات ویژه کالاف موبایل</p>
            
            <div class="active-rooms-list">
                <div class="room-card">
                    <div class="room-header">
                        <h4>تورنمنت هفتگی کالاف</h4>
                        <span class="room-status active">باز</span>
                    </div>
                    <div class="room-details">
                        <p><i class="fas fa-clock"></i> 15 بهمن 20:00</p>
                        <p><i class="fas fa-users"></i> 18/20 نفر</p>
                        <p><i class="fas fa-trophy"></i> جایزه: 5000 امتیاز</p>
                    </div>
                    <button onclick="registerForRoom('weekly_tournament')" class="room-register-btn">ثبت‌نام</button>
                </div>
                
                <div class="room-card">
                    <div class="room-header">
                        <h4>مسابقه اسنایپر</h4>
                        <span class="room-status active">باز</span>
                    </div>
                    <div class="room-details">
                        <p><i class="fas fa-clock"></i> 16 بهمن 18:00</p>
                        <p><i class="fas fa-users"></i> 12/15 نفر</p>
                        <p><i class="fas fa-trophy"></i> جایزه: 3000 امتیاز</p>
                    </div>
                    <button onclick="registerForRoom('sniper_match')" class="room-register-btn">ثبت‌نام</button>
                </div>
                
                <div class="room-card">
                    <div class="room-header">
                        <h4>تورنمنت تیمی</h4>
                        <span class="room-status full">پر</span>
                    </div>
                    <div class="room-details">
                        <p><i class="fas fa-clock"></i> 14 بهمن 22:00</p>
                        <p><i class="fas fa-users"></i> 25/25 نفر</p>
                        <p><i class="fas fa-trophy"></i> جایزه: 10000 امتیاز</p>
                    </div>
                    <button class="room-register-btn disabled" disabled>تکمیل ظرفیت</button>
                </div>
                
                <div class="room-card">
                    <div class="room-header">
                        <h4>مسابقه 1v1</h4>
                        <span class="room-status upcoming">به‌زودی</span>
                    </div>
                    <div class="room-details">
                        <p><i class="fas fa-clock"></i> 17 بهمن 16:00</p>
                        <p><i class="fas fa-users"></i> 0/10 نفر</p>
                        <p><i class="fas fa-trophy"></i> جایزه: 2000 امتیاز</p>
                    </div>
                    <button onclick="registerForRoom('1v1_match')" class="room-register-btn">ثبت‌نام</button>
                </div>
            </div>
            
            <div class="room-actions">
                <button onclick="createPrivateRoom()" class="room-btn">ایجاد روم خصوصی</button>
                <button onclick="viewRoomHistory()" class="room-btn">تاریخچه روم‌ها</button>
            </div>
        </div>
    `);
}

// Join room
function joinRoom(type) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.showAlert(`در حال اتصال به روم ${type === 'public' ? 'عمومی' : 'خصوصی'}...`);
    closeModal();
}

// Create private room
function createPrivateRoom() {
    createModal('ایجاد روم خصوصی', `
        <div class="create-room-modal">
            <div class="room-icon">
                <i class="fas fa-plus-circle"></i>
            </div>
            <h3>ایجاد روم خصوصی</h3>
            <p>روم اختصاصی خود را برای دوستانتان ایجاد کنید</p>
            
            <div class="room-form">
                <div class="form-group">
                    <label>نام روم:</label>
                    <input type="text" placeholder="نام روم را وارد کنید" class="form-input">
                </div>
                <div class="form-group">
                    <label>تعداد بازیکنان:</label>
                    <select class="form-select">
                        <option>4 نفر</option>
                        <option>6 نفر</option>
                        <option>8 نفر</option>
                        <option>10 نفر</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>نوع مسابقه:</label>
                    <select class="form-select">
                        <option>تیم Deathmatch</option>
                        <option>Battle Royale</option>
                        <option>Search and Destroy</option>
                        <option>Domination</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>کد ورود (اختیاری):</label>
                    <input type="text" placeholder="کد ورود به روم" class="form-input">
                </div>
                
                <div class="form-actions">
                    <button onclick="confirmCreateRoom()" class="confirm-btn">ایجاد روم</button>
                    <button onclick="closeModal()" class="cancel-btn">انصراف</button>
                </div>
            </div>
        </div>
    `);
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
                <button onclick="adminManagement()" class="admin-btn">
                    <i class="fas fa-user-shield"></i>
                    <span>مدیریت ادمین‌ها</span>
                </button>
                <button onclick="addNewAdmin()" class="admin-btn">
                    <i class="fas fa-user-plus"></i>
                    <span>افزودن ادمین</span>
                </button>
            </div>
        </div>
    `);
}

// Admin functions
function adminTaskManager() {
    createModal('📝 مدیریت تسک‌ها', `
        <div class="admin-task-modal">
            <div class="admin-header">
                <div class="admin-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <h3>مدیریت تسک‌ها و مأموریت‌ها</h3>
                <p class="admin-subtitle">ایجاد و مدیریت تسک‌های کاربران</p>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <span class="stat-number">12</span>
                    <span class="stat-label">کل تسک‌ها</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">8</span>
                    <span class="stat-label">تسک‌های فعال</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">245</span>
                    <span class="stat-label">انجام شده</span>
                </div>
            </div>
            
            <div class="admin-actions">
                <button onclick="createNewTask()" class="admin-action-btn primary">
                    <i class="fas fa-plus"></i>
                    <span>ایجاد تسک جدید</span>
                </button>
                <button onclick="viewActiveTasks()" class="admin-action-btn">
                    <i class="fas fa-list"></i>
                    <span>مشاهده تسک‌های فعال</span>
                </button>
                <button onclick="viewTaskStats()" class="admin-action-btn">
                    <i class="fas fa-chart-bar"></i>
                    <span>آمار و گزارش‌ها</span>
                </button>
                <button onclick="selectTaskWinner()" class="admin-action-btn">
                    <i class="fas fa-trophy"></i>
                    <span>انتخاب برنده</span>
                </button>
            </div>
            
            <div class="recent-tasks">
                <h4>تسک‌های اخیر</h4>
                <div class="task-list">
                    <div class="task-item-admin">
                        <div class="task-info-admin">
                            <h5>دعوت از 3 دوست</h5>
                            <p>50 امتیاز • 89 نفر انجام داده‌اند</p>
                        </div>
                        <div class="task-status active">فعال</div>
                    </div>
                    <div class="task-item-admin">
                        <div class="task-info-admin">
                            <h5>انجام 5 تسک روزانه</h5>
                            <p>30 امتیاز • 156 نفر انجام داده‌اند</p>
                        </div>
                        <div class="task-status active">فعال</div>
                    </div>
                    <div class="task-item-admin">
                        <div class="task-info-admin">
                            <h5>پیوستن به کانال تلگرام</h5>
                            <p>25 امتیاز • 234 نفر انجام داده‌اند</p>
                        </div>
                        <div class="task-status inactive">غیرفعال</div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function adminReferralSystem() {
    createModal('👥 سیستم رفرال', `
        <div class="admin-referral-modal">
            <div class="admin-header">
                <div class="admin-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>مدیریت سیستم رفرال</h3>
                <p class="admin-subtitle">کنترل دعوت‌ها و پاداش‌ها</p>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <span class="stat-number">1,247</span>
                    <span class="stat-label">کل دعوت‌ها</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">892</span>
                    <span class="stat-label">دعوت موفق</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">12,470</span>
                    <span class="stat-label">امتیاز تخصیص یافته</span>
                </div>
            </div>
            
            <div class="referral-settings">
                <h4>تنظیمات فعلی</h4>
                <div class="setting-row">
                    <label>وضعیت سیستم:</label>
                    <div class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </div>
                </div>
                <div class="setting-row">
                    <label>امتیاز هر دعوت:</label>
                    <input type="number" value="10" class="setting-input">
                </div>
                <div class="setting-row">
                    <label>بازه زمانی:</label>
                    <select class="setting-select">
                        <option>7 روز</option>
                        <option>14 روز</option>
                        <option>30 روز</option>
                    </select>
                </div>
                <div class="setting-row">
                    <label>سقف امتیاز:</label>
                    <input type="number" value="100" class="setting-input">
                </div>
            </div>
            
            <div class="admin-actions">
                <button onclick="updateReferralSettings()" class="admin-action-btn primary">
                    <i class="fas fa-save"></i>
                    <span>ذخیره تنظیمات</span>
                </button>
                <button onclick="viewReferralList()" class="admin-action-btn">
                    <i class="fas fa-list"></i>
                    <span>مشاهده لیست دعوت‌ها</span>
                </button>
                <button onclick="blockFakeReferrals()" class="admin-action-btn">
                    <i class="fas fa-ban"></i>
                    <span>مسدود رفرال‌های تقلبی</span>
                </button>
            </div>
        </div>
    `);
}

function adminCustomRooms() {
    createModal('🎮 کاستوم روم‌ها', `
        <div class="admin-rooms-modal">
            <div class="admin-header">
                <div class="admin-icon">
                    <i class="fas fa-door-open"></i>
                </div>
                <h3>مدیریت کاستوم روم‌ها</h3>
                <p class="admin-subtitle">ایجاد و مدیریت رویدادهای بازی</p>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <span class="stat-number">8</span>
                    <span class="stat-label">کل روم‌ها</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">5</span>
                    <span class="stat-label">روم‌های فعال</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">127</span>
                    <span class="stat-label">شرکت‌کنندگان</span>
                </div>
            </div>
            
            <div class="admin-actions">
                <button onclick="createNewRoom()" class="admin-action-btn primary">
                    <i class="fas fa-plus"></i>
                    <span>ایجاد روم جدید</span>
                </button>
                <button onclick="manageActiveRooms()" class="admin-action-btn">
                    <i class="fas fa-list"></i>
                    <span>مدیریت روم‌های فعال</span>
                </button>
                <button onclick="viewRoomParticipants()" class="admin-action-btn">
                    <i class="fas fa-users"></i>
                    <span>شرکت‌کنندگان</span>
                </button>
                <button onclick="selectRoomWinner()" class="admin-action-btn">
                    <i class="fas fa-trophy"></i>
                    <span>انتخاب برنده</span>
                </button>
            </div>
            
            <div class="active-rooms">
                <h4>روم‌های فعال</h4>
                <div class="room-list">
                    <div class="room-item-admin">
                        <div class="room-info-admin">
                            <h5>تورنمنت هفتگی کالاف</h5>
                            <p>15 بهمن 20:00 • 18/20 نفر</p>
                        </div>
                        <div class="room-actions">
                            <button class="room-action-btn edit">ویرایش</button>
                            <button class="room-action-btn close">بستن</button>
                        </div>
                    </div>
                    <div class="room-item-admin">
                        <div class="room-info-admin">
                            <h5>مسابقه اسنایپر</h5>
                            <p>16 بهمن 18:00 • 12/15 نفر</p>
                        </div>
                        <div class="room-actions">
                            <button class="room-action-btn edit">ویرایش</button>
                            <button class="room-action-btn close">بستن</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function adminLotteries() {
    createModal('🎰 قرعه‌کشی‌ها', `
        <div class="admin-lottery-modal">
            <div class="admin-header">
                <div class="admin-icon">
                    <i class="fas fa-dice"></i>
                </div>
                <h3>مدیریت قرعه‌کشی‌ها</h3>
                <p class="admin-subtitle">کنترل قرعه‌کشی‌های هفتگی و ماهانه</p>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <span class="stat-number">4</span>
                    <span class="stat-label">قرعه‌کشی‌های فعال</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">2,847</span>
                    <span class="stat-label">شرکت‌کنندگان</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">850M</span>
                    <span class="stat-label">جایزه کل (تومان)</span>
                </div>
            </div>
            
            <div class="admin-actions">
                <button onclick="createNewLottery()" class="admin-action-btn primary">
                    <i class="fas fa-plus"></i>
                    <span>ایجاد قرعه‌کشی جدید</span>
                </button>
                <button onclick="manageActiveLotteries()" class="admin-action-btn">
                    <i class="fas fa-list"></i>
                    <span>مدیریت قرعه‌کشی‌ها</span>
                </button>
                <button onclick="viewLotteryParticipants()" class="admin-action-btn">
                    <i class="fas fa-users"></i>
                    <span>شرکت‌کنندگان</span>
                </button>
                <button onclick="selectLotteryWinner()" class="admin-action-btn">
                    <i class="fas fa-dice"></i>
                    <span>انتخاب برنده</span>
                </button>
            </div>
            
            <div class="active-lotteries">
                <h4>قرعه‌کشی‌های فعال</h4>
                <div class="lottery-list">
                    <div class="lottery-item-admin">
                        <div class="lottery-info-admin">
                            <h5>قرعه‌کشی هفتگی بهمن</h5>
                            <p>جمعه 21:00 • 1,234 نفر • 100M تومان</p>
                        </div>
                        <div class="lottery-actions">
                            <button class="lottery-action-btn edit">ویرایش</button>
                            <button class="lottery-action-btn draw">قرعه‌کشی</button>
                        </div>
                    </div>
                    <div class="lottery-item-admin">
                        <div class="lottery-info-admin">
                            <h5>قرعه‌کشی ماهانه اسفند</h5>
                            <p>1 اسفند 20:00 • 1,613 نفر • 500M تومان</p>
                        </div>
                        <div class="lottery-actions">
                            <button class="lottery-action-btn edit">ویرایش</button>
                            <button class="lottery-action-btn draw">قرعه‌کشی</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// Admin action functions
function createNewTask() {
    tg.showAlert('فرم ایجاد تسک جدید به زودی باز می‌شود!');
}

function viewActiveTasks() {
    tg.showAlert('لیست تسک‌های فعال به زودی نمایش داده می‌شود!');
}

function viewTaskStats() {
    tg.showAlert('آمار و گزارش‌های تسک‌ها به زودی نمایش داده می‌شود!');
}

function selectTaskWinner() {
    tg.showAlert('پنل انتخاب برنده تسک به زودی باز می‌شود!');
}

function updateReferralSettings() {
    tg.showAlert('تنظیمات رفرال با موفقیت ذخیره شد!');
}

function viewReferralList() {
    tg.showAlert('لیست کامل دعوت‌ها به زودی نمایش داده می‌شود!');
}

function blockFakeReferrals() {
    tg.showAlert('سیستم تشخیص رفرال‌های تقلبی به زودی فعال می‌شود!');
}

function createNewRoom() {
    tg.showAlert('فرم ایجاد روم جدید به زودی باز می‌شود!');
}

function manageActiveRooms() {
    tg.showAlert('مدیریت کامل روم‌ها به زودی باز می‌شود!');
}

function viewRoomParticipants() {
    tg.showAlert('لیست شرکت‌کنندگان روم‌ها به زودی نمایش داده می‌شود!');
}

function selectRoomWinner() {
    tg.showAlert('پنل انتخاب برنده روم به زودی باز می‌شود!');
}

function createNewLottery() {
    tg.showAlert('فرم ایجاد قرعه‌کشی جدید به زودی باز می‌شود!');
}

function manageActiveLotteries() {
    tg.showAlert('مدیریت کامل قرعه‌کشی‌ها به زودی باز می‌شود!');
}

function viewLotteryParticipants() {
    tg.showAlert('لیست شرکت‌کنندگان قرعه‌کشی‌ها به زودی نمایش داده می‌شود!');
}

function selectLotteryWinner() {
    tg.showAlert('پنل انتخاب برنده قرعه‌کشی به زودی باز می‌شود!');
}

// Admin Management Functions
function adminManagement() {
    createModal('🛡️ مدیریت ادمین‌ها', `
        <div class="admin-management-modal">
            <div class="admin-header">
                <div class="admin-icon">
                    <i class="fas fa-user-shield"></i>
                </div>
                <h3>مدیریت ادمین‌ها</h3>
                <p class="admin-subtitle">مشاهده و مدیریت تمام ادمین‌های سیستم</p>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <span class="stat-number">5</span>
                    <span class="stat-label">کل ادمین‌ها</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">3</span>
                    <span class="stat-label">ادمین‌های فعال</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">2</span>
                    <span class="stat-label">ادمین‌های اصلی</span>
                </div>
            </div>
            
            <div class="admin-actions">
                <button onclick="addNewAdmin()" class="admin-action-btn primary">
                    <i class="fas fa-user-plus"></i>
                    <span>افزودن ادمین جدید</span>
                </button>
                <button onclick="viewAdminLogs()" class="admin-action-btn">
                    <i class="fas fa-history"></i>
                    <span>لاگ فعالیت‌ها</span>
                </button>
                <button onclick="adminPermissions()" class="admin-action-btn">
                    <i class="fas fa-key"></i>
                    <span>مدیریت دسترسی‌ها</span>
                </button>
                <button onclick="exportAdminList()" class="admin-action-btn">
                    <i class="fas fa-download"></i>
                    <span>خروجی لیست</span>
                </button>
            </div>
            
            <div class="admin-list">
                <h4>لیست ادمین‌ها</h4>
                <div class="admin-item-list">
                    <div class="admin-item">
                        <div class="admin-info">
                            <div class="admin-avatar">
                                <img src="https://via.placeholder.com/40" alt="Admin">
                            </div>
                            <div class="admin-details">
                                <h5>مسعود ادمین اصلی</h5>
                                <p>ID: 123456789 • سطح: اصلی</p>
                            </div>
                        </div>
                        <div class="admin-actions-row">
                            <button class="admin-action-small edit">ویرایش</button>
                            <button class="admin-action-small remove">حذف</button>
                        </div>
                    </div>
                    <div class="admin-item">
                        <div class="admin-info">
                            <div class="admin-avatar">
                                <img src="https://via.placeholder.com/40" alt="Admin">
                            </div>
                            <div class="admin-details">
                                <h5>علی ادمین</h5>
                                <p>ID: 987654321 • سطح: عادی</p>
                            </div>
                        </div>
                        <div class="admin-actions-row">
                            <button class="admin-action-small edit">ویرایش</button>
                            <button class="admin-action-small remove">حذف</button>
                        </div>
                    </div>
                    <div class="admin-item">
                        <div class="admin-info">
                            <div class="admin-avatar">
                                <img src="https://via.placeholder.com/40" alt="Admin">
                            </div>
                            <div class="admin-details">
                                <h5>سارا ادمین</h5>
                                <p>ID: 456789123 • سطح: عادی</p>
                            </div>
                        </div>
                        <div class="admin-actions-row">
                            <button class="admin-action-small edit">ویرایش</button>
                            <button class="admin-action-small remove">حذف</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function addNewAdmin() {
    createModal('➕ افزودن ادمین جدید', `
        <div class="add-admin-modal">
            <div class="admin-header">
                <div class="admin-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <h3>افزودن ادمین جدید</h3>
                <p class="admin-subtitle">افزودن کاربر جدید به عنوان ادمین سیستم</p>
            </div>
            
            <div class="admin-form">
                <div class="form-group">
                    <label for="adminUsername">نام کاربری تلگرام:</label>
                    <input type="text" id="adminUsername" placeholder="@username" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="adminUserId">شناسه کاربری (User ID):</label>
                    <input type="number" id="adminUserId" placeholder="123456789" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="adminName">نام کامل:</label>
                    <input type="text" id="adminName" placeholder="نام کامل ادمین" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="adminLevel">سطح دسترسی:</label>
                    <select id="adminLevel" class="form-select">
                        <option value="basic">ادمین عادی</option>
                        <option value="advanced">ادمین پیشرفته</option>
                        <option value="super">ادمین اصلی</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="adminPermissions">دسترسی‌ها:</label>
                    <div class="permissions-grid">
                        <label class="permission-item">
                            <input type="checkbox" checked>
                            <span>مدیریت تسک‌ها</span>
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" checked>
                            <span>مدیریت رفرال</span>
                        </label>
                        <label class="permission-item">
                            <input type="checkbox">
                            <span>مدیریت روم‌ها</span>
                        </label>
                        <label class="permission-item">
                            <input type="checkbox">
                            <span>مدیریت قرعه‌کشی</span>
                        </label>
                        <label class="permission-item">
                            <input type="checkbox">
                            <span>مدیریت ادمین‌ها</span>
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" checked>
                            <span>مشاهده آمار</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button onclick="confirmAddAdmin()" class="admin-action-btn primary">
                        <i class="fas fa-check"></i>
                        <span>تأیید و افزودن ادمین</span>
                    </button>
                    <button onclick="cancelAddAdmin()" class="admin-action-btn">
                        <i class="fas fa-times"></i>
                        <span>انصراف</span>
                    </button>
                </div>
            </div>
        </div>
    `);
}

// Additional admin management functions
function viewAdminLogs() {
    tg.showAlert('لاگ فعالیت‌های ادمین‌ها به زودی نمایش داده می‌شود!');
}

function adminPermissions() {
    tg.showAlert('مدیریت دسترسی‌های ادمین‌ها به زودی باز می‌شود!');
}

function exportAdminList() {
    tg.showAlert('لیست ادمین‌ها با موفقیت دانلود شد!');
}

function confirmAddAdmin() {
    tg.showAlert('ادمین جدید با موفقیت به سیستم اضافه شد!');
    closeModal();
}

function cancelAddAdmin() {
    closeModal();
}

// User Action Functions
function performTask(taskType, current, required) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    switch(taskType) {
        case 'invite':
            showInviteDialog();
            break;
        case 'daily':
            tg.showAlert(`شما ${current} از ${required} تسک روزانه را انجام داده‌اید!`);
            break;
        case 'channel':
            tg.showAlert('لطفا در کانال تلگرام گیمینو عضو شوید: @gaminoland');
            break;
        default:
            tg.showAlert('در حال انجام تسک...');
    }
}

function joinLottery(type) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    const prize = type === 'weekly' ? '۱۰۰ میلیون تومان' : '۵۰۰ میلیون تومان';
    const time = type === 'weekly' ? 'جمعه ۲۱:۰۰' : '۱ اسفند ۲۰:۰۰';
    
    createModal(`شرکت در قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'}`, `
        <div class="lottery-confirm-modal">
            <div class="lottery-icon">
                <i class="fas fa-gift"></i>
            </div>
            <h3>تأیید شرکت در قرعه‌کشی</h3>
            <p>جایزه: ${prize}</p>
            <p>زمان قرعه‌کشی: ${time}</p>
            <p class="lottery-fee">هزینه شرکت: 50 امتیاز</p>
            <div class="lottery-confirm-actions">
                <button onclick="confirmLotteryJoin('${type}')" class="confirm-btn">تأیید و شرکت</button>
                <button onclick="closeModal()" class="cancel-btn">انصراف</button>
            </div>
        </div>
    `);
}

function confirmLotteryJoin(type) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    tg.showAlert(`شما با موفقیت در قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'} شرکت کردید!`);
    closeModal();
}

function viewLotteryHistory() {
    createModal('📜 تاریخچه قرعه‌کشی‌ها', `
        <div class="lottery-history-modal">
            <h3>سابقه شرکت شما</h3>
            <div class="history-list">
                <div class="history-item">
                    <div class="history-info">
                        <h4>قرعه‌کشی هفتگی</h4>
                        <p>تاریخ: ۷ بهمن ۱۴۰۲</p>
                    </div>
                    <div class="history-result lost">برنده نشدید</div>
                </div>
                <div class="history-item">
                    <div class="history-info">
                        <h4>قرعه‌کشی ماهانه</h4>
                        <p>تاریخ: ۱ بهمن ۱۴۰۲</p>
                    </div>
                    <div class="history-result lost">برنده نشدید</div>
                </div>
                <div class="history-item">
                    <div class="history-info">
                        <h4>قرعه‌کشی ویژه</h4>
                        <p>تاریخ: ۲۰ دی ۱۴۰۲</p>
                    </div>
                    <div class="history-result won">برنده شدید! 🎉</div>
                </div>
            </div>
        </div>
    `);
}

function registerForRoom(roomId) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    const roomNames = {
        'weekly_tournament': 'تورنمنت هفتگی کالاف',
        'sniper_match': 'مسابقه اسنایپر',
        '1v1_match': 'مسابقه 1v1'
    };
    
    tg.showAlert(`شما با موفقیت در ${roomNames[roomId]} ثبت‌نام کردید!`);
    closeModal();
}

function viewRoomHistory() {
    createModal('📜 تاریخچه روم‌ها', `
        <div class="room-history-modal">
            <h3>سابقه شرکت شما</h3>
            <div class="history-list">
                <div class="history-item">
                    <div class="history-info">
                        <h4>تورنمنت هفتگی کالاف</h4>
                        <p>تاریخ: ۱۰ بهمن ۱۴۰۲</p>
                    </div>
                    <div class="history-result">رتبه 5</div>
                </div>
                <div class="history-item">
                    <div class="history-info">
                        <h4>مسابقه اسنایپر</h4>
                        <p>تاریخ: ۵ بهمن ۱۴۰۲</p>
                    </div>
                    <div class="history-result">رتبه 2</div>
                </div>
                <div class="history-item">
                    <div class="history-info">
                        <h4>تورنمنت تیمی</h4>
                        <p>تاریخ: ۱ بهمن ۱۴۰۲</p>
                    </div>
                    <div class="history-result winner">برنده شدید! 🏆</div>
                </div>
            </div>
        </div>
    `);
}

function confirmCreateRoom() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    tg.showAlert('روم خصوصی شما با موفقیت ایجاد شد!');
    closeModal();
}

function toggleSetting(setting, value) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    console.log(`Setting ${setting} changed to: ${value}`);
    
    if (setting === 'haptic' && !value) {
        tg.HapticFeedback = null;
    }
}

function changeLanguage(lang) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    tg.showAlert(`زبان برنامه به ${lang === 'fa' ? 'فارسی' : 'English'} تغییر یافت!`);
}

function showRules() {
    createModal('📋 قوانین و مقررات', `
        <div class="rules-modal">
            <h3>قوانین استفاده از گیمینو لند</h3>
            <div class="rules-content">
                <div class="rule-item">
                    <h4>۱. احترام متقابل</h4>
                    <p>لطفاً با سایر کاربران با احترام رفتار کنید.</p>
                </div>
                <div class="rule-item">
                    <h4>۲. تقلب ممنوع</h4>
                    <p>هرگونه تقلب در مسابقات و تسک‌ها ممنوع است.</p>
                </div>
                <div class="rule-item">
                    <h4>۳. قوانین کالاف موبایل</h4>
                    <p>تمام مسابقات طبق قوانین رسمی کالاف موبایل انجام می‌شود.</p>
                </div>
                <div class="rule-item">
                    <h4>۴. جوایز</h4>
                    <p>جوایز ظرف ۲۴ ساعت کاری به برندگان تعلق می‌گیرد.</p>
                </div>
                <div class="rule-item">
                    <h4>۵. حریم خصوصی</h4>
                    <p>اطلاعات کاربران محرمانی بوده و به هیچ‌کس فروخته نمی‌شود.</p>
                </div>
            </div>
        </div>
    `);
}

function contactSupport() {
    createModal('📞 پشتیبانی', `
        <div class="support-modal">
            <h3>ارتباط با پشتیبانی</h3>
            <div class="support-options">
                <div class="support-item">
                    <i class="fas fa-telegram"></i>
                    <div>
                        <h4>تلگرام</h4>
                        <p>@gaminoland_support</p>
                    </div>
                </div>
                <div class="support-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>ایمیل</h4>
                        <p>support@gaminoland.com</p>
                    </div>
                </div>
                <div class="support-item">
                    <i class="fas fa-globe"></i>
                    <div>
                        <h4>وبسایت</h4>
                        <p>www.gaminoland.com</p>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function logout() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('heavy');
    }
    
    if (confirm('آیا از خروج از حساب کاربری مطمئن هستید؟')) {
        tg.showAlert('شما با موفقیت از حساب کاربری خارج شدید!');
        // In real app, this would clear user data and redirect to login
    }
}

function saveSettings() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    tg.showAlert('تنظیمات با موفقیت ذخیره شد!');
    closeModal();
}

function resetSettings() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    if (confirm('آیا از بازنشانی تنظیمات مطمئن هستید؟')) {
        tg.showAlert('تنظیمات به حالت اولیه بازگشت!');
        closeModal();
    }
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
