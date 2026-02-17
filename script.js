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
    
    // نمایش دکمه ادمین اگر کاربر ادمین باشد
    if (isAdmin && document.getElementById('adminBtn')) {
        document.getElementById('adminBtn').classList.remove('hidden');
    }
    
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
        tg.showAlert('لطفاً ابتدا روی دکمه "شروع گردونه" کلیک کنید!');
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

// توابع پنل ادمین
function showUserPanel() {
    tg.showAlert('پنل مدیریت کاربران به زودی اضافه می‌شود!');
}

function showLotteryPanel() {
    tg.showAlert('پنل مدیریت قرعه‌کشی به زودی اضافه می‌شود!');
}

function showTaskPanel() {
    tg.showAlert('پنل مدیریت تسک‌ها به زودی اضافه می‌شود!');
}

function showRoomPanel() {
    tg.showAlert('پنل مدیریت روم‌ها به زودی اضافه می‌شود!');
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
