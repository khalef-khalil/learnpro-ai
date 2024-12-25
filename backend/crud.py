from sqlalchemy.orm import Session
from database import Topic, Resource

def create_topic(db: Session, topic_data):
    topic = Topic(**topic_data.dict())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

def create_resource(db: Session, resource_data):
    resource = Resource(**resource_data.dict())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource

def get_all_topics(db: Session):
    return db.query(Topic).all()

def get_resources_by_topic(db: Session, topic_id):
    return db.query(Resource).filter(Resource.topic_id == topic_id).all()

def get_resource_by_id(db: Session, resource_id: int):
    return db.query(Resource).filter(Resource.id == resource_id).first()