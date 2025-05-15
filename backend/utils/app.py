from flask import Flask, request, jsonify
from flask_cors import CORS
from db_manager import DatabaseManager

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
@app.route('/api/users/<login>', methods=['GET'])
def get_user(login):
    user = db.get_user(login)

    if user:
        return jsonify(user)
    return jsonify({'error': 'Пользователь не найден'}), 404


# Получение отзывов о пользователе
@app.route('/api/users/<login>/comments/', methods=['GET'])
def get_user_feedback(login):
    feedback = db.get_user_feedback(login)

    if feedback != []:
        return jsonify(feedback)
    return jsonify({'error': 'Отзыв не найден'}), 404


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
    success = db.get_announcements()
    return jsonify(success)


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
    success = db.get_announcement(login, number)

    if success:
        return jsonify(success)
    return jsonify({'error': 'Объявление не найдено'}), 404


# Получение отзывов об объявлении
@app.route('/api/announcements/<login>/<number>/comments/', methods=['GET'])
def get_announcement_feedback(login, number):
    success = db.get_announcement_feedback(login, number)

    if success != []:
        return jsonify(success)
    return jsonify({'error': 'Объявление не найдено'}), 404


# Создание отзыва об объявлении
@app.route('/api/announcements/<login>/<number>/comments/', methods=['POST'])
def create_announcement_feedback(login, number):
    data = request.get_json()
    required_field = ['sender_login', 'master_login', 'number', 'text']

    if not data or not all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    success = db.db.create_announcement_feedback(
        sender_login=data['sender_login'],
        master_login=data['master_login'],
        number=data['number'],
        text=data['text']
    )

    if success:
        return jsonify({'message': 'Новый отзыв об объявлении создан'}), 201
    return jsonify({'error': 'Ошибка при добавления отзыва'}), 400


if __name__ == '__main__':
    app.run(debug=True)
