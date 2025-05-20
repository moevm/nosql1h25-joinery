from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.db_manager import DatabaseManager
from utils.utils import convert


app = Flask(__name__)
CORS(app)
db = DatabaseManager()


# Проверочная страница
@app.route('/')
def index():
    return "API работает!"


# Создание нового пользователя
@app.route('/api/users/', methods=['POST'])
def create_user():
    data = request.get_json()
    required_field = ['login', 'password', 'role', 'full_name', 'age']
    if not data or not all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    success = db.create_user(
        login=data['login'],
        password=data['password'],
        role=data['role'],
        full_name=data['full_name'],
        age=data['age'],
        status=data.get('status', 'active'),
        description=data.get('description', ''),
        education=data.get('education', ''),
        photo_url=data.get('photo_url', 'no_photo.png')
    )

    if success:
        return jsonify({'message': 'Пользователь создан'}), 201
    return jsonify({'message': 'Пользователь уже существует'}), 400


# Получение пользователя по его логину
@app.route('/api/users/<login>/', methods=['GET'])
def get_user(login):
    user = db.get_user(login)

    if user:
        return jsonify(convert(user))
    return jsonify({'error': 'Пользователь не найден'}), 404


# Получение отзывов о пользователе
@app.route('/api/users/<login>/comments/', methods=['GET'])
def get_user_feedback(login):
    feedback = db.get_user_feedback(login)

    if feedback:
        return jsonify(feedback)
    return jsonify({'error': 'Пользователь не найден'}), 404


# Создание отзыва о пользователе
@app.route('/api/users/<login>/comments/', methods=['POST'])
def create_user_feedback(login):
    data = request.get_json()
    required_field = ['sender_login', 'text', 'estimation']
    if not data or not all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    success = db.create_user_feedback(
        sender_login=data['sender_login'],
        recipient_login=login,
        text=data['text'],
        estimation=data['estimation'],
    )

    if success:
        return jsonify({'message': 'Отзыв создан'}), 201
    return jsonify({'error': 'Ошибка при создании отзыва'}), 400


# Получение всех объявлений, возможность фильтрации
@app.route('/api/announcements/', methods=['GET'])
def get_announcements():
    filters = {
        'name': '', 'master': '', 'width_min': .0, 'width_max': .0, 
        'height_min': .0, 'height_max': .0, 'length_min': .0, 
        'length_max': .0, 'weight_min': .0, 'weight_max': .0,
        'amount_min': 0, 'amount_max': 0, 'price_min': .0, 
        'price_max': .0, 'address': ''
    }
    data = {}
    for filter, value in filters.items():
        data[filter] = request.args.get(filter, default=value)
        try:
            data[filter] = type(value)(data[filter])
        except (ValueError, TypeError):
            return jsonify({'error': f'Некорректный тип данных {filter}'}), 400
    announcements = db.get_announcements(**data)
    return jsonify(convert(announcements))


# Создание нового объявления
@app.route('/api/announcements/', methods=['POST'])
def create_announcement():
    data = request.get_json()
    required_field = ['login', 'name', 'width', 'height', 'length',
                      'weight', 'amount', 'price', 'address']

    if not data or not all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    success = db.create_announcement(
        login=data['login'],
        name=data['name'],
        width=data['width'],
        height=data['height'],
        length=data['length'],
        weight=data['weight'],
        amount=data['amount'],
        price=data['price'],
        address=data['address'],
        description=data.get('description', ''),
        photo_url=data.get('photo_url', 'no_photo.png')
    )

    if success:
        return jsonify({'message': 'Новое объявление создано'}), 201
    return jsonify({'error': 'Пользователь не найден'}), 404


# Получение объявления по логину мастера и номеру
@app.route('/api/announcements/<login>/<number>/', methods=['GET'])
def get_announcement(login, number):
    if not number.isnumeric():
        return jsonify({'error': 'Номер объявления некорректный'}), 401
    number = int(number)

    success = db.get_announcement(login, number)

    if success:
        return jsonify(convert(success))
    return jsonify({'error': 'Объявление не найдено'}), 404


# Получение отзывов об объявлении
@app.route('/api/announcements/<login>/<number>/comments/', methods=['GET'])
def get_announcement_feedback(login, number):
    if not number.isnumeric():
        return jsonify({'error': 'Номер объявления некорректный'}), 401
    number = int(number)

    success = db.get_announcement_feedback(login, number)

    if success:
        return jsonify(success)
    return jsonify({'error': 'Объявление не найдено'}), 404


# Оставление комментария
@app.route('/api/announcements/<login>/<number>/comments/', methods=['POST'])
def create_announcement_feedback(login, number):
    data = request.get_json()
    required_field = ['sender_login', 'text']

    if not data or not all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    if not number.isnumeric():
        return jsonify({'error': 'Номер объявления некорректный'}), 401
    number = int(number)

    success = db.create_announcement_feedback(
        sender_login=data['sender_login'],
        master_login=login,
        number=number,
        text=data['text']
    )
    
    if success:
        return jsonify({'message': 'OK'}), 201
    return jsonify({'error': 'Объявление не найдено'}), 404


# Авторизация пользователя с логином и паролем
@app.route('/api/login/', methods=['POST'])
def login():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')

    if not login or not password:
        return jsonify({'error': 'Не хватает логина или пароля'}), 400

    if db.authorize_user(login, password):
        user = db.get_user(login)
        return jsonify({
            'message': 'Успешный вход',
            'login': login,
            'role': user.get('role', ''),
            'full_name': user.get('full_name', '')
        }), 200
    else:
        return jsonify({'error': 'Неверный логин или пароль'}), 401



if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
