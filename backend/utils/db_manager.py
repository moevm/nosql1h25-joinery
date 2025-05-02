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
