const tg = window.Telegram.WebApp;
tg.expand(); // باز کردن کامل مینی‌اپ در تلگرام

let currentUser = null;
let appStarted = false;
let isAdmin = false;

// لیست آیدی عددی ادمین‌ها
const ADMIN_IDS = [1771570402]; // می‌توانید آیدی‌های ادمین را اینجا اضافه کنید

// نمایش اطلاعات کاربر در خوش آمدگویی
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    currentUser = tg.initDataUnsafe.user;
    
    // چک کردن ادمین بودن کاربر
    isAdmin = ADMIN_IDS.includes(currentUser.id);
    
    // نمایش نام کاربر در صفحه خوش آمدگویی
    if (document.getElementById('welcomeUserName')) {
        document.getElementById('welcomeUserName').innerText = currentUser.first_name || 'کاربر گرامی';
    }
    
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

// شروع اپلیکیشن بعد از خوش آمدگویی
function startApp() {
    appStarted = true;
    
    // مخفی کردن صفحه خوش آمدگویی
    document.getElementById('welcomeScreen').classList.add('hidden');
    
    // نمایش اپلیکیشن اصلی
    document.getElementById('mainApp').classList.remove('hidden');
    
    // نمایش دکمه ادمین اگر کاربر ادمین باشد
    if (isAdmin && document.getElementById('adminBtn')) {
        document.getElementById('adminBtn').classList.remove('hidden');
    }
    
    // بازخورد لمسی
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    
    // بارگذاری اطلاعات کاربر از سرور (در آینده)
    loadUserData();
}

// تابع تغییر صفحات برای طراحی جدید
function showPage(pageId) {
    if (!appStarted && pageId !== 'mainPage') {
        tg.showAlert('لطفاً ابتدا روی دکمه "شروع بازی" کلیک کنید!');
        return;
    }
    
    // مخفی کردن تمام صفحات
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    
    if (pageId === 'mainPage') {
        // صفحه اصلی از قبل نمایش داده شده
        updateNavigation('mainPage');
    } else if (pageId === 'profilePage') {
        // نمایش صفحه پروفایل
        document.getElementById('profilePage').classList.remove('hidden');
        updateNavigation('profilePage');
    } else if (pageId === 'adminPage') {
        // چک کردن مجدد ادمین بودن
        if (!isAdmin) {
            tg.showAlert('شما دسترسی به این بخش را ندارید!');
            return;
        }
        // نمایش صفحه ادمین
        document.getElementById('adminPage').classList.remove('hidden');
        updateNavigation('adminPage');
    } else if (pageId === 'leaderboardPage') {
        tg.showAlert('لیدربورد به زودی اضافه می‌شود!');
    } else if (pageId === 'tasksPage') {
        tg.showAlert('ماموریت‌ها به زودی اضافه می‌شود!');
    } else if (pageId === 'invitePage') {
        showInviteDialog();
    } else if (pageId === 'winnersPage') {
        tg.showAlert('صفحه برندگان به زودی اضافه می‌شود!');
    } else if (pageId === 'settingsPage') {
        tg.showAlert('تنظیمات به زودی اضافه می‌شود!');
    }
    
    // بازخورد لمسی
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// آپدیت نویگیشن اکتیو
function updateNavigation(activePage) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        item.classList.add('opacity-40');
    });
    
    // پیدا کردن دکمه اکتیو
    const activeButton = document.querySelector(`[onclick="showPage('${activePage}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.classList.remove('opacity-40');
    }
}

// ورود به قرعه‌کشی
function enterLottery(type) {
    if (!appStarted) {
        tg.showAlert('لطفاً ابتدا اپلیکیشن را شروع کنید!');
        return;
    }
    
    const prize = type === 'weekly' ? '۱۰۰ میلیون تومان' : 'جایزه بزرگ فصل';
    tg.showAlert(`شما در قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'} شرکت کردید!\nجایزه: ${prize}`);
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// ورود به کاستوم روم
function enterCustomRoom() {
    if (!appStarted) {
        tg.showAlert('لطفاً ابتدا اپلیکیشن را شروع کنید!');
        return;
    }
    
    tg.showAlert('کاستوم روم به زودی باز می‌شود!');
}

// نمایش دیالوگ دعوت
function showInviteDialog() {
    const inviteLink = `https://t.me/gaminoland_bot?start=${currentUser ? currentUser.id : 'user'}`;
    
    if (tg.shareURL) {
        tg.shareURL(inviteLink, 'به گیمینو لند بپیوندید و برنده جوایز بزرگ شوید!');
    } else {
        tg.showAlert(`لینک دعوت شما:\n${inviteLink}`);
    }
}

// توابع مدیریت تسک‌ها
function showTaskManager() {
    createModal('مدیریت تسک‌ها', `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
                <input type="text" id="taskTitle" placeholder="عنوان تسک" class="admin-input">
                <input type="number" id="taskPoints" placeholder="امتیاز" class="admin-input">
            </div>
            <textarea id="taskDesc" placeholder="توضیحات تسک" class="admin-input"></textarea>
            <div class="grid grid-cols-2 gap-3">
                <input type="datetime-local" id="taskStartTime" class="admin-input">
                <input type="datetime-local" id="taskEndTime" class="admin-input">
            </div>
            <div class="flex gap-2">
                <button class="admin-btn" onclick="saveTask()">ذخیره تسک</button>
                <button class="admin-btn" onclick="showTaskList()">نمایش تسک‌ها</button>
            </div>
            <div id="tasksList" class="mt-4"></div>
        </div>
    `);
}

function showTaskList() {
    createModal('لیست تسک‌ها', `
        <div id="taskListContent" class="space-y-3">
            <p>در حال بارگذاری...</p>
        </div>
    `);
    loadTasks();
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

// توابع سیستم رفرال
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

function blockFakeReferrals() {
    createModal('مسدود کردن رفرال‌های تقلبی', `
        <div class="space-y-4">
            <input type="text" id="fakeUserId" placeholder="آیدی کاربر متخلف" class="admin-input">
            <textarea id="fakeReason" placeholder="دلیل مسدود شدن" class="admin-input"></textarea>
            <button class="admin-btn" onclick="blockFakeReferral()">مسدود کردن</button>
        </div>
    `);
}

// توابع کاستوم روم
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

function selectRoomWinners() {
    createModal('انتخاب برندگان روم', `
        <div class="space-y-4">
            <select id="roomSelect" class="admin-input">
                <option value="">انتخاب روم...</option>
            </select>
            <div class="flex gap-2">
                <button class="admin-btn" onclick="pickRoomWinner()">انتخاب تصادفی</button>
                <button class="admin-btn" onclick="showRoomParticipantsForSelection()">نمایش شرکت‌کنندگان</button>
            </div>
            <div id="roomWinnerResult"></div>
        </div>
    `);
    loadActiveRooms();
}

// توابع قرعه‌کشی
function createLottery() {
    createModal('ایجاد قرعه‌کشی', `
        <div class="space-y-4">
            <select id="lotteryType" class="admin-input">
                <option value="weekly">هفتگی</option>
                <option value="monthly">ماهانه</option>
            </select>
            <input type="number" id="minPoints" placeholder="حداقل امتیاز لازم" class="admin-input">
            <input type="text" id="lotteryPrize" placeholder="جایزه" class="admin-input">
            <div class="flex gap-2">
                <label class="flex items-center gap-2">
                    <input type="checkbox" id="requireTask">
                    <span>نیاز به انجام تسک خاص</span>
                </label>
                <input type="text" id="requiredTask" placeholder="آیدی تسک مورد نظر" class="admin-input">
            </div>
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

function showLotteryParticipants() {
    createModal('شرکت‌کنندگان قرعه‌کشی', `
        <div class="space-y-4">
            <select id="lotterySelect" class="admin-input">
                <option value="">انتخاب قرعه‌کشی...</option>
            </select>
            <button class="admin-btn" onclick="loadLotteryParticipants()">نمایش شرکت‌کنندگان</button>
            <div id="lotteryParticipantsList"></div>
        </div>
    `);
    loadActiveLotteries();
}

function selectLotteryWinner() {
    createModal('انتخاب برنده قرعه‌کشی', `
        <div class="space-y-4">
            <select id="lotteryWinnerSelect" class="admin-input">
                <option value="">انتخاب قرعه‌کشی...</option>
            </select>
            <div class="flex gap-2">
                <button class="admin-btn" onclick="pickRandomLotteryWinner()">انتخاب تصادفی</button>
                <button class="admin-btn" onclick="pickManualLotteryWinner()">انتخاب دستی</button>
            </div>
            <div id="lotteryWinnerResult"></div>
            <button class="admin-btn" onclick="announceLotteryWinner()">اعلام نتیجه</button>
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

// توابع اجرایی (شبیه‌سازی)
function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const points = document.getElementById('taskPoints').value;
    tg.showAlert(`تسک "${title}" با ${points} امتیاز با موفقیت ایجاد شد!`);
    closeModal();
}

function setReferralStatus(status) {
    tg.showAlert(`سیستم رفرال ${status ? 'فعال' : 'غیرفعال'} شد!`);
    closeModal();
}

function saveReferralSettings() {
    const days = document.getElementById('referralDays').value;
    const points = document.getElementById('referralPoints').value;
    const limit = document.getElementById('referralLimit').value;
    tg.showAlert(`تنظیمات رفرال ذخیره شد: ${days} روز، ${points} امتیاز، سقف ${limit}`);
    closeModal();
}

function saveCustomRoom() {
    const title = document.getElementById('roomTitle').value;
    const capacity = document.getElementById('roomCapacity').value;
    const prize = document.getElementById('roomPrize').value;
    tg.showAlert(`روم "${title}" با ظرفیت ${capacity} و جایزه "${prize}" ایجاد شد!`);
    closeModal();
}

function saveLottery() {
    const type = document.getElementById('lotteryType').value;
    const prize = document.getElementById('lotteryPrize').value;
    const minPoints = document.getElementById('minPoints').value;
    tg.showAlert(`قرعه‌کشی ${type === 'weekly' ? 'هفتگی' : 'ماهانه'} با جایزه "${prize}" ایجاد شد!`);
    closeModal();
}

function pickRandomLotteryWinner() {
    tg.showAlert('برنده به صورت تصادفی انتخاب شد!');
    document.getElementById('lotteryWinnerResult').innerHTML = '<p class="text-green-400">برنده: کاربر شماره ۱۲۳۴</p>';
}

function announceLotteryWinner() {
    tg.showAlert('نتیجه قرعه‌کشی به همه کاربران اعلام شد!');
}

function pickRoomWinner() {
    tg.showAlert('برنده روم به صورت تصادفی انتخاب شد!');
    document.getElementById('roomWinnerResult').innerHTML = '<p class="text-green-400">برنده: کاربر شماره ۵۶۷۸</p>';
}

function blockFakeReferral() {
    const userId = document.getElementById('fakeUserId').value;
    const reason = document.getElementById('fakeReason').value;
    tg.showAlert(`کاربر ${userId} به دلیل "${reason}" مسدود شد!`);
    closeModal();
}

// توابع بارگذاری داده‌ها (شبیه‌سازی)
function loadTasks() {
    const container = document.getElementById('taskListContent');
    if (container) {
        container.innerHTML = `
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">تسک روزانه</h4>
                        <p class="text-xs opacity-60">امتیاز: ۱۰۰ | انجام شده: ۴۵ بار</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem;" onclick="editTask(1)">ویرایش</button>
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem; background: #dc2626;" onclick="deleteTask(1)">حذف</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadTaskStats() {
    const container = document.getElementById('taskStatsContent');
    if (container) {
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-black text-blue-400">۱۲</p>
                    <p class="text-xs opacity-60">کل تسک‌ها</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-black text-green-400">۸</p>
                    <p class="text-xs opacity-60">تسک‌های فعال</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-black text-purple-400">۱,۲۳۴</p>
                    <p class="text-xs opacity-60">مجموع انجام</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-black text-orange-400">۵۶</p>
                    <p class="text-xs opacity-60">برندگان</p>
                </div>
            </div>
        `;
    }
}

function loadReferralList() {
    const container = document.getElementById('referralListContent');
    if (container) {
        container.innerHTML = `
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold">علی رضایی</p>
                        <p class="text-xs opacity-60">دعوت کرده: ۱۵ نفر | امتیاز: ۱۵۰</p>
                    </div>
                </div>
            </div>
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold">مریم احمدی</p>
                        <p class="text-xs opacity-60">دعوت کرده: ۸ نفر | امتیاز: ۸۰</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadCustomRooms() {
    const container = document.getElementById('roomsListContent');
    if (container) {
        container.innerHTML = `
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">روم ویژه شب</h4>
                        <p class="text-xs opacity-60">ظرفیت: ۱۰۰ | شرکت‌کنندگان: ۸۷</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem;">ویرایش</button>
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem; background: #dc2626;">حذف</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadLotteries() {
    const container = document.getElementById('lotteriesListContent');
    if (container) {
        container.innerHTML = `
            <div class="custom-room-box p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">قرعه‌کشی هفتگی</h4>
                        <p class="text-xs opacity-60">جایزه: ۱۰۰ میلیون | شرکت‌کنندگان: ۲,۳۴۵</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem;">ویرایش</button>
                        <button class="admin-btn" style="padding: 6px 12px; font-size: 0.8rem; background: #dc2626;">حذف</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// بارگذاری اطلاعات کاربر از سرور
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        // شبیه‌سازی دریافت اطلاعات از سرور
        setTimeout(() => {
            // آپدیت امتیاز
            if (document.getElementById('userBalance')) {
                document.getElementById('userBalance').innerText = '۱۲,۵۰۰';
            }
            
            // آپدیت رتبه
            if (document.getElementById('userRank')) {
                document.getElementById('userRank').innerText = '۱۲۴';
            }
            
            // آپدیت تعداد دعوت‌ها
            if (document.getElementById('inviteCount')) {
                document.getElementById('inviteCount').innerText = '۸';
            }
            
            // آپدیت تسک‌ها و جوایز در پروفایل
            if (document.getElementById('u_tasks')) {
                document.getElementById('u_tasks').innerText = '۱۵';
            }
            if (document.getElementById('u_prizes')) {
                document.getElementById('u_prizes').innerText = '۲';
            }
        }, 1000);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}
