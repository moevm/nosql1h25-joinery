from neo4j.time import DateTime


def convert(obj):
    if isinstance(obj, dict):
        return {k: convert(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert(v) for v in obj]
    elif isinstance(obj, DateTime):
        return obj.iso_format()
    else:
        return obj
