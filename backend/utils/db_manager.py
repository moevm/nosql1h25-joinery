from neo4j import GraphDatabase


class DatabaseManager:
    '''База данных для сервиса по купле/продаже остатков производства'''

    def __init__(
            self, 
            uri: str = 'bolt://localhost:7687', 
            user: str = 'neo4j', 
            password: str = '12345678'
    ):
        '''Инициализация с подключением к базе данных'''
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.session = self.driver.session()


    def __del__(self):
        '''Деструктор, закрывающий сессию'''
        self.session.close()
        self.driver.close()


    def get_user(self, login: str) -> dict:
        '''Получение пользователя по его логину'''
        user = self.session.execute_read(
            lambda tx: tx.run(
                '''MATCH (u:User {login: $login})
                RETURN u {
                    .login, .role, .full_name, .age,
                    .status, .description, .education,
                    .created_at, .updated_at, .photo_url
                } AS u''',
                login=login
            ).single()
        )
        return dict(user['u']) if user else None


    def user_exists(self, login: str) -> bool:
        '''Проверка, существуют ли пользователь с заданным логином'''
        return self.get_user(login) is not None


    def create_user(self,
            login: str, password: str, role: str, full_name: str, 
            age: int, status: str = 'active', description: str = '',
            education: str = '', photo_url: str = 'no_photo.png'
    ) -> bool:
        '''Создание нового пользователя в базе данных'''
        # Проверка, что пользователя с таким логином не существует
        if self.user_exists(login):
            return False
        # Создание пользователя
        self.session.execute_write(
            lambda tx: tx.run(
                '''CREATE (u:User {
                        login: $login, password: $password, role: $role, 
                        full_name: $full_name, age: $age, status: $status, 
                        created_at: datetime(), updated_at: datetime(),
                        description: $description, education: $education, 
                        photo_url: $photo_url
                    })''',
                login=login, password=password, role=role, 
                full_name=full_name, age=age, status=status,
                description=description, education=education,
                photo_url=photo_url
            )
        )
        return True


    def get_announcement_max_number(self, login: str) -> int:
        '''Возвращает максимальный номер объявления пользователя'''
        result = self.session.execute_read(
            lambda tx: tx.run(
                '''MATCH (:User {login: $login})-[c:Create]->(:Announcement)
                RETURN MAX(c.number) AS max_number''',
                login=login
            ).single()
        )
        return result['max_number'] or 0
    

    def create_announcement(self, login: str,
            name: str, width: float, height: float, length: float,
            weight: float, amount: int, price: float, address: str,
            description: str = '', photo_url: str = 'no_photo.png'
    ) -> bool:
        '''Создание объявления от определённого пользователя с определёнными параметрами'''
        # Проверка пользователя на существование
        if not self.user_exists(login):
            return False
        # Получение количества объявлений пользователя
        number = self.get_announcement_max_number(login)
        # Создание нового объявления
        self.session.execute_write(
            lambda tx: tx.run(
                '''MATCH (u:User {login: $login})
                CREATE (u)-[c:Create {number: $number}]->(a:Announcement {
                        name: $name, width: $width, height: $height, length: $length, 
                        weight: $weight, amount: $amount, price: $price,
                        created_at: datetime(), updated_at: datetime(),
                        address: $address, description: $description, photo_url: $photo_url
                    })''',
                login=login, number=number + 1, name=name, 
                width=width, height=height, length=length, 
                weight=weight, amount=amount, price=price, 
                address=address, description=description,
                photo_url=photo_url
            )
        )
        return True


    def get_announcement(self, login: str, number: int) -> dict:
        '''Получение объявления по мастеру и номеру'''
        announcement = self.session.execute_read(
            lambda tx: tx.run(
                '''MATCH (u:User {login: $login})
                        -[c:Create {number: $number}]->
                        (a:Announcement)
                RETURN a''',
                login=login,
                number=number
            ).single()
        )
        return dict(announcement['a']) if announcement else None


    def get_announcements(self,
            name: str = '', master: str = '',
            width_min: float = .0, width_max: float = .0, 
            height_min: float = .0, height_max: float = .0, 
            length_min: float = .0, length_max: float = .0,
            weight_min: float = .0, weight_max: float = .0,
            amount_min: int = 0, amount_max: int = 0,
            price_min: float = .0, price_max: float = .0,
            address: str = ''
    ) -> list:
        '''Получение списка объявлений по заданным параметрам'''
        # Представление переданных параметров в словаре
        params = locals()
        del params['self']
        # Начальный текст запроса
        query = '''
            MATCH (u:User)-[:Create]->(a:Announcement)
            WHERE a.name CONTAINS $name
            AND u.full_name CONTAINS $master
            AND a.width >= $width_min
            AND a.height >= $height_min
            AND a.length >= $length_min
            AND a.weight >= $weight_min
            AND a.amount >= $amount_min
            AND a.price >= $price_min
            AND a.address CONTAINS $address
        '''
        if width_max != .0: query += ' AND a.width <= $width_max'
        if height_max != .0: query += ' AND a.height <= $height_max'
        if length_max != .0: query += ' AND a.length <= $length_max'
        if weight_max != .0: query += ' AND a.weight <= $weight_max'
        if amount_max != 0: query += ' AND a.amount <= $amount_max'
        if price_max != .0: query += ' AND a.price <= $price_max'
        query += ' RETURN a, u.full_name AS master'
        announcements = self.session.execute_read(
            lambda tx: tx.run(query, **params).data()
        )
        return [{**record['a'], 'master': record['master']} for record in announcements]


    def create_user_feedback(self,
            sender_login: str,
            recipient_login: str,
            text: str,
            estimation: int
    ) -> bool:
        '''Создание отзыва с оценкой о пользователе'''
        if not self.user_exists(sender_login) or not self.user_exists(recipient_login):
            return False
        # Создание нового отзыва
        self.session.execute_write(
            lambda tx: tx.run(
                '''MATCH (u1:User {login: $login1}),
                (u2:User {login: $login2})
                CREATE (u1)-[:Make]->
                       (:Feedback {text: $text})
                       -[:About {estimation: $estimation}]->(u2)''',
                login1=sender_login,
                login2=recipient_login,
                text=text,
                estimation=estimation
            )
        )
        return True


    def create_announcement_feedback(self,
            sender_login: str,
            master_login: str,
            number: int,
            text: str
    ) -> bool:
        '''Создание комментария об объявлении'''
        if (not self.user_exists(sender_login) or 
            self.get_announcement(master_login, number) is None):
            return False
        # Создание нового комментария
        self.session.execute_write(
            lambda tx: tx.run(
                '''MATCH (u:User {login: $login1}),
                (:User {login: $login2})-[c:Create {number: $number}]->(a:Announcement)
                CREATE (u)-[:Make]->
                       (:Feedback {text: $text})
                       -[:About]->(a)''',
                login1=sender_login,
                login2=master_login,
                number=number,
                text=text
            )
        )
        return True


    def get_user_feedback(self, login: str) -> list:
        '''Получение всех отзывов об определённом пользователе'''
        if not self.user_exists(login):
            return None
        feedback = self.session.execute_read(
            lambda tx: tx.run(
                '''MATCH (u:User)-[:Make]->(f:Feedback)-[a:About]->(:User {login: $login})
                RETURN f.text AS text, 
                    a.estimation AS estimation,
                    u.full_name AS author''',
                login=login
            ).data()
        )
        if feedback is not None:
            return feedback
        return []


    def get_announcement_feedback(self, login: str, number: int) -> list:
        '''Получение всех отзывов об определённом объявлении'''
        if self.get_announcement(login, number) is None:
            return None
        feedback = self.session.execute_read(
            lambda tx: tx.run(
                '''
                MATCH (:User {login: $login})
                      -[:Create {number: $number}]->
                      (a:Announcement)
                MATCH (u:User)-[:Make]->(f:Feedback)-[:About]->(a)
                RETURN f.text AS text,
                    u.full_name AS author''',
                login=login,
                number=number
            ).data()
        )
        if feedback is not None:
            return feedback
        return []
