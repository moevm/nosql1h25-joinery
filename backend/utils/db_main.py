from neo4j import GraphDatabase


class DatabaseConnection:
    '''Основа для классов работы с БД, выполняющая подключение к базе данных'''

    def __init__(
        self,
        uri: str = 'bolt://neo4j:7687',
        user: str = 'neo4j',
        password: str = '12345678'
    ):
        '''Инициализация с подключением к базе данных'''
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
    

    def __del__(self):
        '''Деструктор, закрывающий драйвер'''
        self.driver.close()
