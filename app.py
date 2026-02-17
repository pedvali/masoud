from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from database import Database

app = Flask(__name__)
CORS(app)  # فعال کردن CORS برای اتصال فرانت‌اِند
db = Database()

@app.route('/')
def index():
    """صفحه اصلی مینی اپ"""
    return render_template('index.html')

@app.route('/api/user/register', methods=['POST'])
def register_user():
    """ثبت کاربر جدید یا بازگشت اطلاعات کاربر موجود"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    user_id = data.get('id')
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name', '')
    
    # ثبت یا به‌روزرسانی کاربر
    success = db.add_or_update_user(user_id, username, first_name, last_name)
    
    if success:
        user = db.get_user(user_id)
        if user:
            return jsonify({
                'id': user[0],
                'username': user[1],
                'first_name': user[2],
                'points': user[3],
                'referral_count': user[4],
                'join_date': user[5],
                'tasks_completed': user[6] if len(user) > 6 else 0,
                'prizes_won': user[7] if len(user) > 7 else 0,
                'referral_points': user[8] if len(user) > 8 else 0
            })
    
    return jsonify({'error': 'Failed to register user'}), 500

@app.route('/api/user/<user_id>')
def get_user_data(user_id):
    """دریافت اطلاعات کاربر برای مینی اپ"""
    user = db.get_user(user_id)
    if user:
        return jsonify({
            'id': user[0],
            'username': user[1],
            'first_name': user[2],
            'points': user[3],
            'referral_count': user[4],
            'join_date': user[5],
            'tasks_completed': user[6] if len(user) > 6 else 0,
            'prizes_won': user[7] if len(user) > 7 else 0,
            'referral_points': user[8] if len(user) > 8 else 0
        })
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/user/<user_id>/admin')
def check_admin(user_id):
    """بررسی اینکه آیا کاربر ادمین است"""
    # در اینجا می‌توانید منطق بررسی ادمین را پیاده‌سازی کنید
    # مثلاً چک کردن در لیست ادمین‌ها
    admin_users = [1771570402]  # لیست کاربران ادمین
    return jsonify(user_id in admin_users)

@app.route('/api/spin', methods=['POST'])
def spin_wheel():
    """چرخاندن گردونه و ذخیره نتیجه"""
    data = request.get_json()
    user_id = data.get('user_id')
    prize = data.get('prize')
    
    if user_id and prize:
        # ذخیره نتیجه چرخش در دیتابیس
        db.add_wheel_result(user_id, prize)
        
        # به‌روزرسانی امتیازات کاربر
        if prize.isdigit():
            db.update_user_points(user_id, int(prize))
        
        return jsonify({'success': True, 'prize': prize})
    
    return jsonify({'error': 'Invalid data'}), 400

@app.route('/api/tasks')
def get_tasks():
    """دریافت لیست تسک‌های فعال"""
    tasks = db.get_active_tasks()
    return jsonify([{
        'id': task[0],
        'title': task[1],
        'description': task[2],
        'points': task[3],
        'is_active': task[4]
    } for task in tasks])

@app.route('/api/task/complete', methods=['POST'])
def complete_task():
    """انجام تسک و دریافت امتیاز"""
    data = request.get_json()
    user_id = data.get('user_id')
    task_id = data.get('task_id')
    
    if user_id and task_id:
        # بررسی اینکه آیا کاربر قبلاً این تسک را انجام داده است
        if not db.is_task_completed(user_id, task_id):
            # دریافت اطلاعات تسک
            task = db.get_task(task_id)
            if task and task[4]:  # is_active
                # ثبت انجام تسک
                db.complete_user_task(user_id, task_id)
                
                # اضافه کردن امتیاز به کاربر
                db.update_user_points(user_id, task[3])  # points
                
                return jsonify({
                    'success': True, 
                    'points': task[3],
                    'message': 'تسک با موفقیت انجام شد'
                })
        
        return jsonify({'success': False, 'message': 'تسک قبلا انجام شده یا نامعتبر است'}), 400
    
    return jsonify({'error': 'Invalid data'}), 400

@app.route('/api/leaderboard')
def get_leaderboard():
    """دریافت جدول برترین‌ها"""
    leaderboard = db.get_leaderboard()
    return jsonify([{
        'rank': i+1,
        'username': user[1],
        'first_name': user[2],
        'points': user[3],
        'prizes_won': user[7] if len(user) > 7 else 0
    } for i, user in enumerate(leaderboard)])

@app.route('/api/referral/<user_id>')
def get_referral_info(user_id):
    """دریافت اطلاعات رفرال کاربر"""
    user = db.get_user(user_id)
    if user:
        return jsonify({
            'referral_count': user[4] if len(user) > 4 else 0,
            'referral_link': f'https://t.me/gaminoland_bot?start={user_id}',
            'referral_points': user[8] if len(user) > 8 else 0
        })
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/lottery/enter', methods=['POST'])
def enter_lottery():
    """ورود به قرعه‌کشی"""
    data = request.get_json()
    user_id = data.get('user_id')
    lottery_type = data.get('type')  # 'weekly' or 'monthly'
    
    if user_id and lottery_type:
        # بررسی شرایط شرکت در قرعه‌کشی
        user = db.get_user(user_id)
        if user:
            points = user[3]  # points
            
            # حداقل امتیاز برای شرکت
            min_points = 100 if lottery_type == 'weekly' else 200
            
            if points >= min_points:
                # ثبت شرکت در قرعه‌کشی
                success = db.enter_lottery(user_id, lottery_type)
                if success:
                    return jsonify({'success': True, 'message': 'با موفقیت در قرعه‌کشی شرکت کردید'})
            
            return jsonify({'success': False, 'message': f'حداقل امتیاز مورد نیاز: {min_points}'}), 400
    
    return jsonify({'error': 'Invalid data'}), 400

# ========== API های مدیریت ========== //

@app.route('/api/admin/tasks', methods=['GET', 'POST'])
def admin_tasks():
    """مدیریت تسک‌ها"""
    if request.method == 'POST':
        # ایجاد تسک جدید
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        points = data.get('points')
        
        if title and description and points:
            success = db.create_task(title, description, points)
            if success:
                return jsonify({'success': True, 'message': 'تسک با موفقیت ایجاد شد'})
        
        return jsonify({'error': 'Invalid data'}), 400
    else:
        # دریافت لیست تسک‌ها
        tasks = db.get_all_tasks()
        return jsonify([{
            'id': task[0],
            'title': task[1],
            'description': task[2],
            'points': task[3],
            'is_active': task[4],
            'completion_count': task[5] if len(task) > 5 else 0
        } for task in tasks])

@app.route('/api/admin/task/<task_id>', methods=['PUT', 'DELETE'])
def admin_task_detail(task_id):
    """ویرایش یا حذف تسک"""
    if request.method == 'PUT':
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        points = data.get('points')
        is_active = data.get('is_active')
        
        success = db.update_task(task_id, title, description, points, is_active)
        if success:
            return jsonify({'success': True, 'message': 'تسک با موفقیت به‌روزرسانی شد'})
        
        return jsonify({'error': 'Failed to update task'}), 500
    else:
        success = db.delete_task(task_id)
        if success:
            return jsonify({'success': True, 'message': 'تسک با موفقیت حذف شد'})
        
        return jsonify({'error': 'Failed to delete task'}), 500

@app.route('/api/admin/referral/settings', methods=['GET', 'POST'])
def admin_referral_settings():
    """تنظیمات سیستم رفرال"""
    if request.method == 'POST':
        data = request.get_json()
        days = data.get('days')
        points = data.get('points')
        limit = data.get('limit')
        is_active = data.get('is_active')
        
        success = db.update_referral_settings(days, points, limit, is_active)
        if success:
            return jsonify({'success': True, 'message': 'تنظیمات با موفقیت ذخیره شد'})
        
        return jsonify({'error': 'Failed to update settings'}), 500
    else:
        settings = db.get_referral_settings()
        return jsonify({
            'days': settings[0] if settings else 7,
            'points': settings[1] if settings else 1000,
            'limit': settings[2] if settings else 5000,
            'is_active': settings[3] if settings else True
        })

@app.route('/api/admin/referral/list')
def admin_referral_list():
    """لیست دعوت‌کنندگان"""
    referrals = db.get_referral_list()
    return jsonify([{
        'inviter_id': ref[0],
        'inviter_name': ref[1],
        'invited_id': ref[2],
        'invited_name': ref[3],
        'created_at': ref[4]
    } for ref in referrals])

@app.route('/api/admin/custom-rooms', methods=['GET', 'POST'])
def admin_custom_rooms():
    """مدیریت کاستوم روم‌ها"""
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        datetime = data.get('datetime')
        capacity = data.get('capacity')
        prize = data.get('prize')
        
        if title and datetime and capacity and prize:
            success = db.create_custom_room(title, datetime, capacity, prize)
            if success:
                return jsonify({'success': True, 'message': 'روم با موفقیت ایجاد شد'})
        
        return jsonify({'error': 'Invalid data'}), 400
    else:
        rooms = db.get_custom_rooms()
        return jsonify([{
            'id': room[0],
            'title': room[1],
            'datetime': room[2],
            'capacity': room[3],
            'prize': room[4],
            'participants_count': room[5] if len(room) > 5 else 0
        } for room in rooms])

@app.route('/api/admin/lotteries', methods=['GET', 'POST'])
def admin_lotteries():
    """مدیریت قرعه‌کشی‌ها"""
    if request.method == 'POST':
        data = request.get_json()
        lottery_type = data.get('type')
        min_points = data.get('min_points')
        prize = data.get('prize')
        
        if lottery_type and min_points and prize:
            success = db.create_lottery(lottery_type, min_points, prize)
            if success:
                return jsonify({'success': True, 'message': 'قرعه‌کشی با موفقیت ایجاد شد'})
        
        return jsonify({'error': 'Invalid data'}), 400
    else:
        lotteries = db.get_lotteries()
        return jsonify([{
            'id': lottery[0],
            'type': lottery[1],
            'min_points': lottery[2],
            'prize': lottery[3],
            'participants_count': lottery[4] if len(lottery) > 4 else 0,
            'winner_id': lottery[5] if len(lottery) > 5 else None
        } for lottery in lotteries])

@app.route('/api/admin/lottery/<lottery_id>/pick-winner', methods=['POST'])
def admin_pick_winner(lottery_id):
    """انتخاب برنده قرعه‌کشی"""
    data = request.get_json()
    winner_id = data.get('winner_id')  # اگر null باشد، انتخاب تصادفی
    
    success = db.pick_lottery_winner(lottery_id, winner_id)
    if success:
        return jsonify({'success': True, 'message': 'برنده با موفقیت انتخاب شد'})
    
    return jsonify({'error': 'Failed to pick winner'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
