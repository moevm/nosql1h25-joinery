from neo4j import GraphDatabase

# Подключение к Neo4j
uri = "bolt://neo4j:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

def write_data(tx):
    tx.run("CREATE (a:Greeting {message: $message})", message="Hello, World!")

def read_data(tx):
    result = tx.run("MATCH (a:Greeting) RETURN a.message AS message")
    return [record["message"] for record in result]

with driver.session() as session:
    session.write_transaction(write_data)

with driver.session() as session:
    messages = session.read_transaction(read_data)
    for message in messages:
        print(message)

# Закрытие драйвера
driver.close()