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