from sqlalchemy import create_engine, Column, Integer, String, Enum, Text, ForeignKey, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# MySQL Database URL
DATABASE_URL = "mysql+pymysql://root:@localhost/assistant"

# Create Engine and Session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)  # Added length
    description = Column(Text)

class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)  # Added length
    resource_type = Column(Enum("video", "article", "exercise"), nullable=False)
    url = Column(Text)
    description = Column(Text)
    difficulty_level = Column(Enum("beginner", "intermediate", "advanced"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    is_completed = Column(Boolean, default=False)  # Tracks resource completion
    completed_at = Column(DateTime, nullable=True)  # Logs when the resource was completed
    topic = relationship("Topic")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    difficulty_level = Column(Enum("beginner", "intermediate", "advanced"), nullable=False)
    topic = relationship("Topic")

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)  # True for the correct answer, False for incorrect ones
    question = relationship("Question")
    
class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)  # Percentage score for the overall assessment
    logged_at = Column(DateTime, default=datetime.utcnow)

class TopicAssessmentLog(Base):
    __tablename__ = "topic_assessment_logs"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    score = Column(Float, nullable=False)  
    logged_at = Column(DateTime, default=datetime.utcnow)
    topic = relationship("Topic")
    assessment = relationship("Assessment")

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)
