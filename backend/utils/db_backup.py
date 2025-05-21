import json

from .db_main import DatabaseConnection
from .utils import convert, back_convert


class DatabaseExporter(DatabaseConnection):
    '''Создание бэкапа базы данных'''

    def export_data_to_json(self, output_file: str = 'neo4j_export.json') -> None:
        '''Экспорт БД в файл'''
        graph_data = convert(self.get_graph_data())
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(graph_data, f, indent=2, ensure_ascii=False)
    

    def get_graph_data(self) -> dict:
        '''Получение всех данных из базы данных'''
        with self.driver.session() as session:
            graph_data = session.execute_read(self._export_graph)
        return graph_data


    def _export_graph(self, tx):
        # Получение всех узлов с их свойствами
        nodes_query = '''
            MATCH (n)
            RETURN id(n) as id, labels(n) as labels, properties(n) as properties
        '''
        nodes_result = tx.run(nodes_query)
        
        # Получение всех отношений
        rels_query = '''
            MATCH (n)-[r]->(m)
            RETURN id(r) as rel_id, type(r) as type, 
                id(n) as start_node, id(m) as end_node,
                properties(r) as properties
        '''
        rels_result = tx.run(rels_query)
        
        # Сбор узлов
        nodes = []
        for record in nodes_result:
            nodes.append({
                'id': record['id'],
                'labels': record['labels'],
                'properties': record['properties']
            })
        
        # Сбор отношений
        relationships = []
        for record in rels_result:
            relationships.append({
                'id': record['rel_id'],
                'type': record['type'],
                'start_node': record['start_node'],
                "end_node": record['end_node'],
                'properties': record['properties']
            })
        
        return {
            'nodes': nodes,
            'relationships': relationships
        }


class DatabaseImporter(DatabaseConnection):
    '''Загрузка бэкапа базы данных'''

    def import_data(self, input_file='neo4j_export.json'):
        '''Импорт из файла данных для БД'''
        with open(input_file, 'r', encoding='utf-8') as f:
            graph_data = json.load(f)
        self.set_graph_data(back_convert(graph_data))
    

    def set_graph_data(self, graph_data: dict):
        '''Запись данных в БД'''
        with self.driver.session() as session:
            session.execute_write(self._import_graph, graph_data)

    
    def _import_graph(self, tx, graph_data):
        # Удаление предыдущих данных
        tx.run('MATCH ()-[e]->() DELETE e')
        tx.run('MATCH (n) DELETE n')

        # Создание всех узлов
        for node in graph_data.get('nodes', []):
            node_id = node.get('id')
            labels = ':'.join(node.get('labels', []))
            properties = node.get('properties', {})
            
            query = f'''
                CREATE (n:{labels} $props)
                SET n._import_id = $node_id
            '''
            tx.run(query, props=properties, node_id=node_id)
        
        # Создание отношений между узлами
        for rel in graph_data.get('relationships', []):
            rel_type = rel.get('type')
            start_id = rel.get('start_node')
            end_id = rel.get('end_node')
            properties = rel.get('properties', {})
            
            query = '''
                MATCH (a {_import_id: $start_id}), (b {_import_id: $end_id})
                CREATE (a)-[r:%s]->(b)
                SET r = $props
            ''' % rel_type
            
            tx.run(query, start_id=start_id, end_id=end_id, props=properties)
        
        # Удаление временных идентификаторов
        tx.run('MATCH (n) REMOVE n._import_id')


if __name__ == '__main__':
    #exporter = DatabaseExporter()
    #print(exporter.get_graph_data())
    #exporter.export_data_to_json('data.json')
    importer = DatabaseImporter()
    importer.import_data('data.json')
