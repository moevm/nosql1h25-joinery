from .db_main import DatabaseConnection


class DatabaseManager(DatabaseConnection):
    '''База данных для сервиса по купле/продаже остатков производства'''

    def is_empty(self) -> bool:
        '''Проверка базы данных на отсутствие в ней каких-либо элементов'''
        with self.driver.session() as session:
            nodes = session.execute_read(
                lambda tx: tx.run(
                    'MATCH (n) RETURN n'
                ).data()
            )
        return len(nodes) == 0

    
    def get_user(self, login: str) -> dict:
        '''Получение пользователя по его логину'''
        with self.driver.session() as session:
            user = session.execute_read(
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
    

    def authorize_user(self, login: str, password: str) -> bool:
        '''Авторизация пользователя по логину и паролю'''
        with self.driver.session() as session:
            user = session.execute_read(
                lambda tx: tx.run(
                    '''MATCH (u:User {login: $login, password: $password})
                    RETURN u AS u''',
                    login=login,
                    password=password
                ).single()
            )
        return True if user else False


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
        with self.driver.session() as session:
            session.execute_write(
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


    def edit_user(self,
            login: str, full_name: str, age: int, 
            description: str, education: str, photo_url: str
    ) -> bool:
        '''Редактирование существующего пользователя в БД'''
        # Проверка на существование пользователя с таким логином
        if not self.user_exists(login):
            return False
        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(
                    '''MATCH (u:User {login: $login}) 
                       SET u.full_name = $full_name, 
                           u.age = $age,
                           u.updated_at = datetime(),
                           u.description = $description, 
                           u.education = $education, 
                           u.photo_url = $photo_url''',
                    login=login, full_name=full_name, age=age, 
                    description=description, education=education,
                    photo_url=photo_url
                )
            )
        return True


    def set_user_status(self, login: str, new_status: str):
        '''Блокировка и разблокировка пользователя'''
        if not self.user_exists(login):
            return False
        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(
                    '''MATCH (u:User {login: $login}) 
                       SET u.status = $status''',
                    login=login, status=new_status
                )
            )
        return True
    

    def get_announcement_max_number(self, login: str) -> int:
        '''Возвращает максимальный номер объявления пользователя'''
        with self.driver.session() as session:
            result = session.execute_read(
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
        with self.driver.session() as session:
            session.execute_write(
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
        with self.driver.session() as session:
            announcement = session.execute_read(
                lambda tx: tx.run(
                    '''MATCH (u:User {login: $login})
                            -[c:Create {number: $number}]->
                            (a:Announcement)
                    RETURN a, u.login AS master''',
                    login=login,
                    number=number
                ).single()
            )
        return {**announcement['a'], 'master': announcement['master']} if announcement else None


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
            MATCH (u:User)-[c:Create]->(a:Announcement)
            WHERE toLower(a.name) CONTAINS toLower($name)
            AND toLower(u.full_name) CONTAINS toLower($master)
            AND a.width >= $width_min
            AND a.height >= $height_min
            AND a.length >= $length_min
            AND a.weight >= $weight_min
            AND a.amount >= $amount_min
            AND a.price >= $price_min
            AND toLower(a.address) CONTAINS toLower($address)
        '''
        if width_max != .0: query += ' AND a.width <= $width_max'
        if height_max != .0: query += ' AND a.height <= $height_max'
        if length_max != .0: query += ' AND a.length <= $length_max'
        if weight_max != .0: query += ' AND a.weight <= $weight_max'
        if amount_max != 0: query += ' AND a.amount <= $amount_max'
        if price_max != .0: query += ' AND a.price <= $price_max'
        query += ' RETURN a, u.login AS master, c.number AS number'
        with self.driver.session() as session:
            announcements = session.execute_read(
                lambda tx: tx.run(query, **params).data()
            )
        return [{**record['a'], 'master': record['master'], 'number': record['number']} for record in announcements]


    def edit_announcement(self, 
            login: str, number: int,
            name: str, width: float, height: float, length: float,
            weight: float, amount: int, price: float, address: str,
            description, photo_url
    ) -> bool:
        '''Редактирование существубщего объявления'''
        # Проверка пользователя на существование
        if not self.get_announcement(login, number):
            return False
        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(
                    '''MATCH (:User {login: $login})-[:Create {number: $number}]->(a:Announcement)
                       SET a.name = $name, a.width = $width, a.height = $height, 
                           a.length = $length, a.weight = $weight, a.amount = $amount, 
                           a.price = $price, a.updated_at = datetime(), a.address = $address, 
                           a.description = $description, a.photo_url = $photo_url''',
                    login=login, number=number, name=name, 
                    width=width, height=height, length=length, 
                    weight=weight, amount=amount, price=price, 
                    address=address, description=description,
                    photo_url=photo_url
                )
            )
        return True


    def delete_announcement(self, login: str, number: int) -> bool:
        '''Удаление объявления'''
        if not self.get_announcement(login, number):
            return False
        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(
                    '''MATCH (:User {login: $login})-[:Create {number: $number}]->(a:Announcement)
                       DETACH DELETE a''',
                    login=login, number=number
                )
            )
        return True


    def get_feedback_user_user(self,
            sender_login: str,
            recipient_login: str
    ) -> dict:
        '''Получение отзыва о пользователе'''
        with self.driver.session() as session:
            feedback = session.execute_read(
                lambda tx: tx.run(
                    '''MATCH (:User {login: $login1})
                             -[:Make]->(f:Feedback)-[a:About]->
                             (:User {login: $login2})
                    RETURN f, a''',
                    login1=sender_login,
                    login2=recipient_login
                ).single()
            )
        return {**feedback['f'], **feedback['a']} if feedback else None


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
        with self.driver.session() as session:
            session.execute_write(
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


    def delete_user_feedback(self,
            sender_login: str,
            recipient_login: str
    ) -> bool:
        '''Удаление отзыва о пользователе'''
        if self.get_feedback_user_user(sender_login, recipient_login) is None:
            return False
        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(
                    '''MATCH (:User {login: $login1})
                             -[:Make]->(f:Feedback)-[:About]->
                             (:User {login: $login2})
                        DETACH DELETE f''',
                    login1=sender_login,
                    login2=recipient_login
                )
            )
        return True


    def get_feedback_user_announcement(self,
            sender_login: str,
            master_login: str,
            number: int
    ) -> bool:
        '''Получение отзыва об объявлении'''
        with self.driver.session() as session:
            feedback = session.execute_read(
                lambda tx: tx.run(
                    '''MATCH (:User {login: $login1})-[:Create {number: $number}]->(a:Announcement)
                       MATCH (:User {login: $login2})
                             -[:Make]->(f:Feedback)-[:About]->
                             (a)
                       RETURN f, a''',
                    login1=master_login,
                    number=number,
                    login2=sender_login
                ).single()
            )
        return dict(feedback['f']) if feedback else None


    def delete_announcement_feedback(self,
            sender_login: str,
            master_login: str,
            number: int
    ) -> bool:
        '''Удаление отзыва об объявлении'''
        if self.get_feedback_user_announcement(sender_login, master_login, number) is None:
            return False
        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(
                    '''MATCH (:User {login: $login1})-[:Create {number: $number}]->(a:Announcement)
                       MATCH (:User {login: $login2})
                             -[:Make]->(f:Feedback)-[:About]->
                             (a)
                       DETACH DELETE f''',
                    login1=master_login,
                    number=number,
                    login2=sender_login
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
        with self.driver.session() as session:
            session.execute_write(
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
        with self.driver.session() as session:
            feedback = session.execute_read(
                lambda tx: tx.run(
                    '''MATCH (u:User)-[:Make]->(f:Feedback)-[a:About]->(:User {login: $login})
                    RETURN f.text AS text, 
                        a.estimation AS estimation,
                        u.login AS author''',
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
        with self.driver.session() as session:
            feedback = session.execute_read(
                lambda tx: tx.run(
                    '''
                    MATCH (:User {login: $login})
                        -[:Create {number: $number}]->
                        (a:Announcement)
                    MATCH (u:User)-[:Make]->(f:Feedback)-[:About]->(a)
                    RETURN f.text AS text,
                        u.login AS author''',
                    login=login,
                    number=number
                ).data()
            )
        if feedback is not None:
            return feedback
        return []
