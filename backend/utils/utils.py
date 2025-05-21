from neo4j.time import DateTime
from datetime import datetime


def convert(obj):
    if isinstance(obj, dict):
        return {k: convert(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert(v) for v in obj]
    elif isinstance(obj, DateTime):
        return obj.iso_format()
    else:
        return obj


def back_convert(obj):
    if isinstance(obj, dict):
        return {k: back_convert(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [back_convert(v) for v in obj]
    elif isinstance(obj, str):
        try:
            dt = datetime.fromisoformat(obj)
            return DateTime(
                dt.year, dt.month, dt.day,
                dt.hour, dt.minute, dt.second,
                dt.microsecond * 1000
            )
        except ValueError:
            return obj
    else:
        return obj