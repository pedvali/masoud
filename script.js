const tg = window.Telegram.WebApp;
tg.expand(); // باز کردن کامل مینی‌اپ در تلگرام

let currentUser = null;

// نمایش اطلاعات کاربر در هدر
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    currentUser = tg.initDataUnsafe.user;
    
    // آپدیت نام کاربر در پروفایل
    if (document.getElementById('u_name')) {
        document.getElementById('u_name').innerText = currentUser.first_name || 'کاربر گیمینو';
    }
    
    // آپدیت آیدی کاربر
    if (document.getElementById('u_id')) {
        document.getElementById('u_id').innerText = currentUser.id;
    }
    
    // آپدیت آواتار کاربر
    if (currentUser.photo_url && document.getElementById('u_avatar')) {
        document.getElementById('u_avatar').src = currentUser.photo_url;
    }
}

// تابع تغییر صفحات برای طراحی جدید
function showPage(pageId) {
    if (pageId === 'mainPage') {
        // مخفی کردن صفحه پروفایل
        document.getElementById('profilePage').classList.add('hidden');
    } else if (pageId === 'profilePage') {
        // نمایش صفحه پروفایل
        document.getElementById('profilePage').classList.remove('hidden');
    } else if (pageId === 'leaderboardPage') {
        // در آینده لیدربورد را اینجا اضافه کنید
        tg.showAlert('لیدربورد به زودی اضافه می‌شود!');
    }
    
    // بازخورد لمسی
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// آماده‌سازی اپلیکیشن
function initApp() {
    tg.ready();
    tg.expand();
    
    // دریافت اطلاعات واقعی کاربر از تلگرام
    const user = tg.initDataUnsafe.user;
    if (user) {
        currentUser = user;
        updateUI(user);
        checkAdminStatus(user.id);
        
        // ذخیره کاربر در دیتابیس
        saveUserToDatabase();
    }
}

// ۲. آپدیت کردن فیلدهای پروفایل
function updateUI(user) {
    if(document.getElementById('u_name')) document.getElementById('u_name').innerText = user.first_name || "کاربر گیمینو";
    if(document.getElementById('u_id')) document.getElementById('u_id').innerText = user.id;
    
    // اینجا در آینده باید اطلاعات تسک و امتیاز را از دیتابیس بگیرید (fetch)
}

// مدیریت جابجایی بین صفحات
function showPage(pageId) {
    tg.HapticFeedback.impactOccurred('light'); // بازخورد لمسی
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });
    
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
    
    // تغییر حالت اکتیو منوی پایین
    updateNavUI(pageId);
    
    // بارگذاری داده‌های خاص هر صفحه
    if(pageId === 'leaderboard') loadLeaderboard();
    if(pageId === 'invitePage') loadReferralLink();
    if(pageId === 'tasksPage') loadTasks();
}

// ۴. چک کردن ادمین بودن (آیدی ادمین را اینجا جایگزین کنید)
function checkAdminStatus(userId) {
    const ADMIN_IDS = [1771570402]; // لیست آیدی عددی ادمین‌ها
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
    
    // پیدا کردن و فعال کردن دکمه منوی مربوطه
    const activeButton = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// ذخیره کاربر در دیتابیس
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
            // به‌روزرسانی اطلاعات کاربر با داده‌های دیتابیس
            currentUser = { ...currentUser, ...data };
            loadUserData();
        }
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

// بارگذاری اطلاعات کامل کاربر از دیتابیس
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/user/${currentUser.id}`);
        if (response.ok) {
            const userData = await response.json();
            
            // به‌روزرسانی اطلاعات پروفایل
            if(document.getElementById('u_tasks')) document.getElementById('u_tasks').innerText = userData.tasks_completed || 0;
            if(document.getElementById('u_prizes')) document.getElementById('u_prizes').innerText = userData.prizes_won || 0;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// تابع کپی لینک دعوت
function copyLink() {
    const link = `https://t.me/gaminoland_bot?start=${currentUser.id}`;
    navigator.clipboard.writeText(link);
    tg.showAlert("لینک دعوت کپی شد!");
}

// بارگذاری لینک رفرال
function loadReferralLink() {
    if(currentUser) {
        const linkElement = document.getElementById('referralLink');
        if(linkElement) {
            linkElement.textContent = `https://t.me/gaminoland_bot?start=${currentUser.id}`;
        }
    }
}

// دریافت لیست لیدربورد از بک‌اِند (Flask)
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard'); // مطابق با app.py
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

// بارگذاری تسک‌ها از بک‌اِند
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

// انجام تسک
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
            loadUserData(); // بارگذاری مجدد اطلاعات کاربر
            loadTasks(); // بارگذاری مجدد تسک‌ها
        } else {
            tg.showAlert(data.message || 'خطا در انجام تسک');
        }
    } catch (e) { 
        console.error("خطا در انجام تسک", e);
        tg.showAlert('خطا در اتصال به سرور');
    }
}

// ========== توابع مدیریت ========== //

// مدیریت تسک‌ها
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

function showTaskStats() {
    createModal('آمار تسک‌ها', `
        <div id="taskStatsContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadTaskStats();
}

function showTaskWinners() {
    createModal('برندگان تسک', `
        <div id="taskWinnersContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadTaskWinners();
}

// سیستم رفرال
function toggleReferralSystem() {
    createModal('سیستم رفرال', `
        <div class="space-y-4">
            <p>آیا می‌خواهید سیستم رفرال را فعال/غیرفعال کنید؟</p>
            <div class="flex gap-2">
                <button class="admin-btn" onclick="setReferralStatus(true)">فعال کردن</button>
                <button class="admin-btn" onclick="setReferralStatus(false)">غیرفعال کردن</button>
            </div>
        </div>
    `);
}

function showReferralSettings() {
    createModal('تنظیمات رفرال', `
        <div class="space-y-4">
            <input type="number" id="referralDays" placeholder="تعداد روز فعال بودن" class="admin-input">
            <input type="number" id="referralPoints" placeholder="امتیاز هر دعوت" class="admin-input">
            <input type="number" id="referralLimit" placeholder="سقف امتیاز رفرال" class="admin-input">
            <button class="admin-btn" onclick="saveReferralSettings()">ذخیره تنظیمات</button>
        </div>
    `);
}

function showReferralList() {
    createModal('لیست دعوت‌کنندگان', `
        <div id="referralListContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadReferralList();
}

// کاستوم روم
function createCustomRoom() {
    createModal('ایجاد کاستوم روم', `
        <div class="space-y-4">
            <input type="text" id="roomTitle" placeholder="عنوان رویداد" class="admin-input">
            <input type="datetime-local" id="roomDateTime" class="admin-input">
            <input type="number" id="roomCapacity" placeholder="ظرفیت" class="admin-input">
            <input type="text" id="roomPrize" placeholder="جایزه" class="admin-input">
            <button class="admin-btn" onclick="saveCustomRoom()">ایجاد روم</button>
        </div>
    `);
}

function manageCustomRooms() {
    createModal('مدیریت روم‌ها', `
        <div id="roomsListContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadCustomRooms();
}

function showRoomParticipants() {
    createModal('شرکت‌کنندگان', `
        <div id="participantsListContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadRoomParticipants();
}

// قرعه‌کشی
function createLottery() {
    createModal('ایجاد قرعه‌کشی', `
        <div class="space-y-4">
            <select id="lotteryType" class="admin-input">
                <option value="weekly">هفتگی</option>
                <option value="monthly">ماهانه</option>
            </select>
            <input type="number" id="minPoints" placeholder="حداقل امتیاز لازم" class="admin-input">
            <input type="text" id="lotteryPrize" placeholder="جایزه" class="admin-input">
            <button class="admin-btn" onclick="saveLottery()">ایجاد قرعه‌کشی</button>
        </div>
    `);
}

function manageLotteries() {
    createModal('مدیریت قرعه‌کشی‌ها', `
        <div id="lotteriesListContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadLotteries();
}

function selectLotteryWinner() {
    createModal('انتخاب برنده', `
        <div class="space-y-4">
            <select id="lotterySelect" class="admin-input">
                <option value="">انتخاب قرعه‌کشی...</option>
            </select>
            <div class="flex gap-2">
                <button class="admin-btn" onclick="pickRandomWinner()">انتخاب تصادفی</button>
                <button class="admin-btn" onclick="showParticipantsForSelection()">نمایش شرکت‌کنندگان</button>
            </div>
            <div id="winnerResult"></div>
        </div>
    `);
    loadActiveLotteries();
}

// توابع کمکی
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

// ========== توابع اجرایی مدیریت ========== //

// توابع تسک‌ها
async function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const points = document.getElementById('taskPoints').value;
    
    try {
        const response = await fetch('/api/admin/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, points: parseInt(points) })
        });
        
        const data = await response.json();
        if (data.success) {
            tg.showAlert('تسک با موفقیت ایجاد شد');
            closeModal();
        } else {
            tg.showAlert('خطا در ایجاد تسک');
        }
    } catch (e) {
        console.error('Error saving task:', e);
        tg.showAlert('خطا در اتصال به سرور');
    }
}

async function loadTasksList() {
    try {
        const response = await fetch('/api/admin/tasks');
        const tasks = await response.json();
        const container = document.getElementById('tasksList');
        
        container.innerHTML = tasks.map(task => `
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">${task.title}</h4>
                        <p class="text-xs opacity-60">${task.description}</p>
                        <p class="text-xs">امتیاز: ${task.points} | انجام شده: ${task.completion_count}</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem;" onclick="editTask(${task.id})">ویرایش</button>
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem; background: #dc2626;" onclick="deleteTask(${task.id})">حذف</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading tasks:', e);
    }
}

// توابع رفرال
async function saveReferralSettings() {
    const days = document.getElementById('referralDays').value;
    const points = document.getElementById('referralPoints').value;
    const limit = document.getElementById('referralLimit').value;
    
    try {
        const response = await fetch('/api/admin/referral/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                days: parseInt(days), 
                points: parseInt(points), 
                limit: parseInt(limit) 
            })
        });
        
        const data = await response.json();
        if (data.success) {
            tg.showAlert('تنظیمات با موفقیت ذخیره شد');
            closeModal();
        }
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

async function loadReferralList() {
    try {
        const response = await fetch('/api/admin/referral/list');
        const referrals = await response.json();
        const container = document.getElementById('referralListContent');
        
        container.innerHTML = referrals.map(ref => `
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold">${ref.inviter_name}</p>
                        <p class="text-xs opacity-60">دعوت کرده: ${ref.invited_name}</p>
                        <p class="text-xs">تاریخ: ${new Date(ref.created_at).toLocaleDateString('fa-IR')}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading referrals:', e);
    }
}

// توابع کاستوم روم
async function saveCustomRoom() {
    const title = document.getElementById('roomTitle').value;
    const datetime = document.getElementById('roomDateTime').value;
    const capacity = document.getElementById('roomCapacity').value;
    const prize = document.getElementById('roomPrize').value;
    
    try {
        const response = await fetch('/api/admin/custom-rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, datetime, capacity: parseInt(capacity), prize })
        });
        
        const data = await response.json();
        if (data.success) {
            tg.showAlert('روم با موفقیت ایجاد شد');
            closeModal();
        }
    } catch (e) {
        console.error('Error saving room:', e);
    }
}

// توابع قرعه‌کشی
async function saveLottery() {
    const type = document.getElementById('lotteryType').value;
    const minPoints = document.getElementById('minPoints').value;
    const prize = document.getElementById('lotteryPrize').value;
    
    try {
        const response = await fetch('/api/admin/lotteries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, min_points: parseInt(minPoints), prize })
        });
        
        const data = await response.json();
        if (data.success) {
            tg.showAlert('قرعه‌کشی با موفقیت ایجاد شد');
            closeModal();
        }
    } catch (e) {
        console.error('Error saving lottery:', e);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
