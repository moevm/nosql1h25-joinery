from flask import Flask, request, jsonify
from db_manager import DatabaseManager

app = Flask(__name__)
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
    if all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    seccess = db.create_user(
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

    if seccess:
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
    required_field = ['sender_login', 'recipient_login', 'text', 'estimation']
    if all(field in data for field in required_field):
        return jsonify({'error': 'Не хватает полей'}), 400

    seccess = db.create_user_feedback(
        sender_login=data['sender_login'],
        recipient_login=login,
        text=data['text'],
        estimation=data['estimation'],
    )

    if seccess:
        return jsonify({'message': 'Отзыв создан'}), 201
    return jsonify({'error': 'Ошибка при создании отзыва'}), 400


# Получение всех объявлений, возможность фильтрации
@app.route('/api/announcements/', methods=['GET'])
def get_announcements():
    pass


# Создание нового объявления
@app.route('/api/announcements/', methods=['POST'])
def create_announcement():
    pass


# Получение объявления по логину мастера и номеру
@app.route('/api/announcements/<login>/<number>/', methods=['GET'])
def get_announcement(login, number):
    pass


# Получение отзывов об объявлении
@app.route('/api/announcements/<login>/<number>/comments/', methods=['GET'])
def get_announcement_feedback(login, number):
    pass


# Создание отзыва об объявлении
@app.route('/api/announcements/<login>/<number>/comments/', methods=['POST'])
def create_announcement_feedback(login, number):
    pass


if __name__ == '__main__':
    app.run(debug=True)
