from pydantic import BaseModel
from typing import Optional

class TopicCreate(BaseModel):
    name: str
    description: Optional[str]

class ResourceCreate(BaseModel):
    title: str
    resource_type: str
    url: str
    description: Optional[str]
    difficulty_level: str
    topic_id: int