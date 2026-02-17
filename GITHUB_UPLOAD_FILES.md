# فایل‌های مورد نیاز برای آپلود در گیت‌هاب

## 📁 فایل‌های اصلی مینی‌اپ (فرانت‌اِند)

### 1. index.html
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>گیمینو لند</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=6.0">
</head>
<body>
    <div class="main-container">
        <div class="header-ui">
            <button class="profile-btn-new" onclick="showPage('profilePage')">
                <i class="fas fa-user text-white text-xl"></i>
            </button>
            <div class="font-black text-xl">گیمینو لند</div>
            <button id="adminBtn" class="profile-btn-new hidden" onclick="showPage('adminPage')" style="background: linear-gradient(135deg, #fbbf24, #f59e0b);">
                <i class="fas fa-crown text-white text-xl"></i>
            </button>
        </div>

        <div id="mainPage" class="page-content px-5">
            <div class="flex justify-between items-center my-6">
                <h2 class="font-bold text-lg">رتبه‌بندی</h2>
                <button onclick="showPage('leaderboard')" style="color: #fbbf24; font-weight: bold; background: none; border: none;">لیدربورد</button>
            </div>

            <div class="drawing-card weekly-gradient">
                <h3 class="font-black text-xl">قرعه‌کشی هفتگی</h3>
                <p class="text-sm opacity-80 mt-1">جوایز ویژه کاربران فعال</p>
            </div>

            <div class="drawing-card monthly-gradient">
                <h3 class="font-black text-xl">قرعه‌کشی ماهانه</h3>
                <p class="text-sm opacity-80 mt-1">جایزه بزرگ گیمینو لند</p>
            </div>

            <div class="custom-room-box">
                <h3 class="font-bold mb-4 text-center">کاستوم روم</h3>
                <button class="enter-btn">ورود</button>
            </div>
        </div>

        <div id="profilePage" class="page-content hidden px-5 pt-10">
            <div style="background: white; border-radius: 30px; padding: 30px; color: #1e293b; text-align: center;">
                <i class="fas fa-user-circle text-6xl text-blue-600 mb-4"></i>
                <h2 id="u_name" class="font-black text-xl mb-6">کاربر گیمینو</h2>
                
                <div style="text-align: right; border-top: 1px solid #e2e8f0; padding-top: 20px;" class="space-y-4">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>تسک‌های انجام شده:</span> <span id="u_tasks" class="font-bold">۰</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>جوایز برنده شده:</span> <span id="u_prizes" class="font-bold text-green-600">۰</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>آیدی عددی:</span> <span id="u_id" class="text-xs text-gray-400">---</span>
                    </div>
                </div>
                
                <button onclick="showPage('mainPage')" style="margin-top: 30px; width: 100%; padding: 12px; background: #f1f5f9; border-radius: 12px; font-weight: bold; border: none;">بازگشت</button>
            </div>
        </div>

        <div id="tasksPage" class="page-content hidden px-5">
            <h2 class="font-black text-2xl my-6 text-center">تسک‌های روزانه</h2>
            <div class="space-y-4">
                <div class="custom-room-box flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">عضویت در کانال</h4>
                        <p class="text-xs opacity-60">+۵۰۰ امتیاز</p>
                    </div>
                    <button class="enter-btn" style="width: auto; padding: 8px 20px;">انجام</button>
                </div>
            </div>
        </div>

        <div id="invitePage" class="page-content hidden px-5 text-center">
            <div class="drawing-card weekly-gradient mt-10">
                <i class="fas fa-users text-4xl mb-4"></i>
                <h3 class="font-black text-xl">دعوت از دوستان</h3>
                <p class="text-sm opacity-90">با دعوت هر دوست، ۱۰۰۰ امتیاز بگیرید</p>
            </div>
            <div class="custom-room-box mt-5">
                <p class="mb-4 opacity-70">لینک اختصاصی شما:</p>
                <code id="referralLink" class="block bg-black/30 p-3 rounded-lg mb-4 text-xs">https://t.me/your_bot?start=ref_id</code>
                <button class="enter-btn" onclick="copyLink()">کپی لینک دعوت</button>
            </div>
        </div>

        <div id="leaderboard" class="page-content hidden px-5">
            <h2 class="font-black text-2xl my-6 text-center">برترین‌ها</h2>
            <div id="leaderboardList" class="space-y-2">
            </div>
        </div>

        <div id="adminPage" class="page-content hidden px-5">
            <h2 class="font-black text-2xl my-6 text-center">👑 مدیریت</h2>
            
            <!-- Task Management -->
            <div class="admin-section">
                <h3 class="font-bold text-lg mb-4">📋 مدیریت تسک‌ها</h3>
                <div class="space-y-3">
                    <button class="admin-btn" onclick="showTaskManager()">ایجاد/ویرایش تسک</button>
                    <button class="admin-btn" onclick="showTaskStats()">آمار تسک‌ها</button>
                    <button class="admin-btn" onclick="showTaskWinners()">برندگان تسک</button>
                </div>
            </div>

            <!-- Referral Management -->
            <div class="admin-section">
                <h3 class="font-bold text-lg mb-4">👥 سیستم رفرال</h3>
                <div class="space-y-3">
                    <button class="admin-btn" onclick="toggleReferralSystem()">فعال/غیرفعال کردن رفرال</button>
                    <button class="admin-btn" onclick="showReferralSettings()">تنظیمات رفرال</button>
                    <button class="admin-btn" onclick="showReferralList()">لیست دعوت‌کنندگان</button>
                </div>
            </div>

            <!-- Custom Room Management -->
            <div class="admin-section">
                <h3 class="font-bold text-lg mb-4">🎮 کاستوم روم</h3>
                <div class="space-y-3">
                    <button class="admin-btn" onclick="createCustomRoom()">ایجاد رویداد جدید</button>
                    <button class="admin-btn" onclick="manageCustomRooms()">مدیریت روم‌ها</button>
                    <button class="admin-btn" onclick="showRoomParticipants()">شرکت‌کنندگان</button>
                </div>
            </div>

            <!-- Lottery Management -->
            <div class="admin-section">
                <h3 class="font-bold text-lg mb-4">🎁 قرعه‌کشی</h3>
                <div class="space-y-3">
                    <button class="admin-btn" onclick="createLottery()">ایجاد قرعه‌کشی</button>
                    <button class="admin-btn" onclick="manageLotteries()">مدیریت قرعه‌کشی‌ها</button>
                    <button class="admin-btn" onclick="selectLotteryWinner()">انتخاب برنده</button>
                </div>
            </div>

            <button onclick="showPage('mainPage')" class="mt-6 w-full bg-red-500 text-white py-3 rounded-xl font-bold">بازگشت</button>
        </div>

        <nav class="bottom-nav">
            <a href="#" class="nav-item" onclick="showPage('profilePage')"><i class="fas fa-wallet"></i><span>برداشت</span></a>
            <a href="#" class="nav-item" onclick="showPage('tasksPage')"><i class="fas fa-tasks"></i><span>تسک‌ها</span></a>
            <a href="#" class="nav-item active" onclick="showPage('mainPage')"><i class="fas fa-gamepad"></i><span>گیمینو لند</span></a>
            <a href="#" class="nav-item" onclick="showPage('invitePage')"><i class="fas fa-share"></i><span>دعوت</span></a>
        </nav>
    </div>

    <script src="script.js?v=6.0"></script>
</body>
</html>
```

### 2. style.css
```css
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap');

* {
    font-family: 'Vazirmatn', sans-serif;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    background-color: #0f172a;
    background-image: 
        radial-gradient(circle at top left, rgba(79, 70, 229, 0.15), transparent 300px),
        radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.1), transparent 300px);
    margin: 0;
    color: white;
    min-height: 100vh;
}

.main-container {
    max-width: 500px;
    margin: 0 auto;
    padding-bottom: 100px;
}

.drawing-card {
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.weekly-gradient {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
}

.monthly-gradient {
    background: linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%);
}

.custom-room-box {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 20px;
    margin-top: 24px;
}

.enter-btn {
    background: #2563eb;
    color: white;
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    font-weight: 900;
    font-size: 1.1rem;
    border: none;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    transition: 0.2s;
}

.enter-btn:active { transform: scale(0.97); }

.header-ui {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.profile-btn-new {
    background: rgba(255, 255, 255, 0.1);
    width: 45px;
    height: 45px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: space-around;
    padding: 15px 10px 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    z-index: 1000;
}

.nav-item {
    color: #64748b;
    text-decoration: none;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.nav-item.active { color: #3b82f6; }
.nav-item i { font-size: 22px; }

.hidden { display: none !important; }

.admin-section {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
}

.admin-btn {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
    border: none;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    transition: all 0.2s;
    text-align: right;
}

.admin-btn:active {
    transform: scale(0.97);
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
}

.admin-section h3 {
    color: #fbbf24;
    margin-bottom: 12px;
    font-size: 1.1rem;
}

.space-y-3 > * + * {
    margin-top: 12px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
}

.modal-content {
    background: #1e293b;
    border-radius: 20px;
    max-width: 400px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
    margin: 0;
    color: #fbbf24;
    font-size: 1.2rem;
}

.modal-close {
    background: none;
    border: none;
    color: #64748b;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-body {
    padding: 20px;
}

.admin-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(30, 41, 59, 0.5);
    color: white;
    font-size: 0.9rem;
    margin-bottom: 12px;
}

.admin-input::placeholder {
    color: #64748b;
}

.admin-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.flex {
    display: flex;
}

.gap-2 {
    gap: 8px;
}

.space-y-4 > * + * {
    margin-top: 16px;
}
```

### 3. script.js
```javascript
let tg = window.Telegram.WebApp;
let currentUser = null;

function initApp() {
    tg.ready();
    tg.expand();
    
    const user = tg.initDataUnsafe.user;
    if (user) {
        currentUser = user;
        updateUI(user);
        checkAdminStatus(user.id);
        saveUserToDatabase();
    }
}

function updateUI(user) {
    if(document.getElementById('u_name')) document.getElementById('u_name').innerText = user.first_name || "کاربر گیمینو";
    if(document.getElementById('u_id')) document.getElementById('u_id').innerText = user.id;
}

function showPage(pageId) {
    tg.HapticFeedback.impactOccurred('light');
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });
    
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
    
    updateNavUI(pageId);
    
    if(pageId === 'leaderboard') loadLeaderboard();
    if(pageId === 'invitePage') loadReferralLink();
    if(pageId === 'tasksPage') loadTasks();
}

function checkAdminStatus(userId) {
    const ADMIN_IDS = [1771570402];
    if (ADMIN_IDS.includes(userId)) {
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            adminBtn.classList.remove('hidden');
        }
    }
}

function updateNavUI(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

async function saveUserToDatabase() {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: currentUser.id,
                username: currentUser.username || `user${currentUser.id}`,
                first_name: currentUser.first_name,
                last_name: currentUser.last_name || ''
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = { ...currentUser, ...data };
            loadUserData();
        }
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/user/${currentUser.id}`);
        if (response.ok) {
            const userData = await response.json();
            
            if(document.getElementById('u_tasks')) document.getElementById('u_tasks').innerText = userData.tasks_completed || 0;
            if(document.getElementById('u_prizes')) document.getElementById('u_prizes').innerText = userData.prizes_won || 0;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function copyLink() {
    const link = `https://t.me/gaminoland_bot?start=${currentUser.id}`;
    navigator.clipboard.writeText(link);
    tg.showAlert("لینک دعوت کپی شد!");
}

function loadReferralLink() {
    if(currentUser) {
        const linkElement = document.getElementById('referralLink');
        if(linkElement) {
            linkElement.textContent = `https://t.me/gaminoland_bot?start=${currentUser.id}`;
        }
    }
}

async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        const listContainer = document.getElementById('leaderboardList');
        listContainer.innerHTML = '';

        data.forEach((user, index) => {
            listContainer.innerHTML += `
                <div class="custom-room-box flex justify-between items-center py-3">
                    <div class="flex items-center gap-3">
                        <span class="font-black ${index < 3 ? 'text-yellow-400' : ''}">#${index + 1}</span>
                        <span>${user.first_name}</span>
                    </div>
                    <span class="font-bold">${user.points} امتیاز</span>
                </div>
            `;
        });
    } catch (e) { console.error("خطا در بارگذاری لیدربورد", e); }
}

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        const tasksContainer = document.querySelector('#tasksPage .space-y-4');
        tasksContainer.innerHTML = '';

        tasks.forEach(task => {
            tasksContainer.innerHTML += `
                <div class="custom-room-box flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">${task.title}</h4>
                        <p class="text-xs opacity-60">+${task.points} امتیاز</p>
                    </div>
                    <button class="enter-btn" style="width: auto; padding: 8px 20px;" onclick="completeTask(${task.id})">انجام</button>
                </div>
            `;
        });
    } catch (e) { console.error("خطا در بارگذاری تسک‌ها", e); }
}

async function completeTask(taskId) {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/task/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                task_id: taskId
            })
        });
        
        const data = await response.json();
        if (data.success) {
            tg.showAlert(`تسک با موفقیت انجام شد! +${data.points} امتیاز`);
            loadUserData();
            loadTasks();
        } else {
            tg.showAlert(data.message || 'خطا در انجام تسک');
        }
    } catch (e) { 
        console.error("خطا در انجام تسک", e);
        tg.showAlert('خطا در اتصال به سرور');
    }
}

function showTaskManager() {
    const modal = createModal('مدیریت تسک‌ها', `
        <div class="space-y-4">
            <input type="text" id="taskTitle" placeholder="عنوان تسک" class="admin-input">
            <textarea id="taskDesc" placeholder="توضیحات تسک" class="admin-input"></textarea>
            <input type="number" id="taskPoints" placeholder="امتیاز" class="admin-input">
            <div class="flex gap-2">
                <button class="admin-btn" onclick="saveTask()">ذخیره تسک</button>
                <button class="admin-btn" onclick="loadTasksList()">نمایش تسک‌ها</button>
            </div>
            <div id="tasksList" class="mt-4"></div>
        </div>
    `);
}

function createModal(title, content) {
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
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

document.addEventListener('DOMContentLoaded', initApp);
```

## 📋 فایل‌های پیکربندی

### 4. .env.example
```
TELEGRAM_BOT_TOKEN=7806790096:AAFRsSDs6IeEimD5-Cot9fbWVeT2qMCe5z0
ADMIN_USER_ID=1771570402
BOT_USERNAME=MiniAppmasoud_bot
PORT=3000
WEB_APP_URL=https://pedvali.github.io/masoud/
```

### 5. .gitignore
```
.env
database.db
__pycache__/
*.pyc
.DS_Store
```

### 6. README.md
```
# گیمینو لند - مینی‌اپ تلگرام

یک مینی‌اپ کامل تلگرام با سیستم مدیریت جامع

## 🚀 امکانات

- 🎮 بازی و قرعه‌کشی هفتگی/ماهانه
- 👥 سیستم رفرال و دعوت از دوستان
- 📋 مدیریت تسک‌ها و مأموریت‌ها
- 🏆 لیدربورد و رتبه‌بندی کاربران
- 👑 پنل مدیریت کامل برای ادمین‌ها
- 🎁 کاستوم روم و رویدادهای خاص

## 📦 نصب و راه‌اندازی

1. کلون کردن ریپازیتوری
2. نصب نیازمندی‌ها: `pip install -r requirements.txt`
3. کپی فایل `.env.example` به `.env` و تنظیم مقادیر
4. اجرای ربات: `python bot.py`

## 🛠️ تنظیمات

- توکن ربات تلگرام در `.env` تنظیم شود
- آیدی ادمین‌ها در `script.js` و `.env` وارد شود
- وب‌اپ تلگرام به آدرس GitHub Pages متصل شود

## 📱 استفاده

- ربات را در تلگرام جستجو و استارت کنید
- دکمه "Web App" را برای ورود به مینی‌اپ بزنید
- از تمام امکانات اپلیکیشن لذت ببرید!

## 👑 مدیریت ادمین

ادمین‌ها با دکمه تاج در هدر به پنل مدیریت دسترسی دارند و می‌توانند:
- تسک‌ها را ایجاد و مدیریت کنند
- قرعه‌کشی‌ها را برگزار کنند
- کاربران را مدیریت کنند
- جوایز را تخصیص دهند

## 📞 پشتیبانی

برای اطلاعات بیشتر و پشتیبانی به کانال تلگرام ما مراجعه کنید.
```

## 🔗 نکات مهم

1. **آیدی ادمین**: در `script.js` خط 52 آیدی خودت رو جایگزین کن
2. **توکن ربات**: در `.env` توکن واقعی ربات رو قرار بده  
3. **GitHub Pages**: حتماً GitHub Pages رو فعال کن
4. **WebApp URL**: در تلگرام به آدرس گیت‌هاب پیج متصل کن

این همه فایل‌هایی هست که برای آپلود در گیت‌هاب نیاز داری! 🚀
