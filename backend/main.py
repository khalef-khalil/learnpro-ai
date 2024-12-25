from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, Question, Answer, Resource, Assessment, TopicAssessmentLog, Topic
from crud import create_topic, create_resource, get_all_topics, get_resources_by_topic, get_resource_by_id
from models import TopicCreate, ResourceCreate
from knowledge_base import KnowledgeBaseEngine, Recommendation
from fastapi.middleware.cors import CORSMiddleware
from error_handlers import validation_exception_handler, not_found_exception_handler
from datetime import datetime
from pydantic import BaseModel, ValidationError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines (remplacez par des domaines spécifiques en prod)
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP
    allow_headers=["*"],  # Autorise tous les en-têtes
)

# Register custom error handlers
app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, not_found_exception_handler)

# Pydantic model for input validation
class AssessmentInput(BaseModel):
    score: float

class TopicAssessmentInput(BaseModel):
    topic_id: int
    score: float

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Existing Endpoints

@app.post("/topics/")
def add_topic(topic: TopicCreate, db: Session = Depends(get_db)):
    return create_topic(db, topic)

@app.post("/resources/")
def add_resource(resource: ResourceCreate, db: Session = Depends(get_db)):
    return create_resource(db, resource)

@app.get("/topics/")
def list_topics(db: Session = Depends(get_db)):
    return get_all_topics(db)

@app.get("/topics/{topic_id}/resources")
def list_resources(topic_id: int, db: Session = Depends(get_db)):
    return get_resources_by_topic(db, topic_id)

@app.get("/resources/")
def list_resources(
    topic_id: int = None,
    resource_type: str = None,
    difficulty_level: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Resource)
    if topic_id:
        query = query.filter(Resource.topic_id == topic_id)
    if resource_type:
        query = query.filter(Resource.resource_type == resource_type)
    if difficulty_level:
        query = query.filter(Resource.difficulty_level == difficulty_level)

    resources = query.all()

    return [
        {
            "id": resource.id,
            "title": resource.title,
            "type": resource.resource_type,
            "difficulty": resource.difficulty_level,
            "description": resource.description,
            "url": resource.url,
            "topic_id": resource.topic_id,
            "is_completed": resource.is_completed,
            "completed_at": resource.completed_at
        }
        for resource in resources
    ]

@app.get("/resources/{resource_id}")
def get_resource_details(resource_id: int, db: Session = Depends(get_db)):
    resource = get_resource_by_id(db, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {
        "id": resource.id,
        "title": resource.title,
        "type": resource.resource_type,
        "difficulty": resource.difficulty_level,
        "description": resource.description,
        "url": resource.url,
        "topic_id": resource.topic_id,
        "is_completed": resource.is_completed,
        "completed_at": resource.completed_at
    }
    
@app.post("/resources/{resource_id}/complete/")
def mark_resource_as_completed(resource_id: int, db: Session = Depends(get_db)):
    """
    Mark a resource as completed and log the completion date.
    """
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found.")

    resource.is_completed = True
    resource.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(resource)

    return {
        "message": "Resource marked as completed.",
        "resource_id": resource_id,
        "completed_at": resource.completed_at
    }
    
@app.get("/assessments/")
def get_all_assessments(db: Session = Depends(get_db)):
    """
    Fetch all assessments and their scores.
    """
    assessments = db.query(Assessment).all()
    return [
        {
            "assessment_id": assessment.id,
            "score": assessment.score,
            "logged_at": assessment.logged_at
        }
        for assessment in assessments
    ]


@app.post("/assessments/log/")
def log_assessment(payload: AssessmentInput, db: Session = Depends(get_db)):
    """
    Log the overall results for an assessment.
    """
    assessment = Assessment(
        score=payload.score,
        logged_at=datetime.utcnow()
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "message": "Assessment logged successfully.",
        "assessment_id": assessment.id,
        "score": assessment.score,
        "logged_at": assessment.logged_at
    }
    
@app.get("/assessments/{assessment_id}/topics/")
def get_topic_assessment_results(assessment_id: int, db: Session = Depends(get_db)):
    """
    Fetch topic-specific assessment results for a given assessment.
    """
    logs = db.query(TopicAssessmentLog).filter(TopicAssessmentLog.assessment_id == assessment_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No topic assessments found for this assessment.")

    return [
        {
            "topic_id": log.topic_id,
            "topic_name": log.topic.name,
            "score": log.score,
            "logged_at": log.logged_at
        }
        for log in logs
    ]
    
@app.get("/assessments/topics/last5/all/")
def get_last_5_assessment_results_for_all_topics(db: Session = Depends(get_db)):
    """
    Fetch the topic-specific assessment results for the last 5 assessments for all topics.
    """
    # Query the last 5 assessments for all topics, grouped by topic_id
    topic_logs = (
        db.query(TopicAssessmentLog)
        .order_by(TopicAssessmentLog.topic_id, TopicAssessmentLog.logged_at.desc())
        .all()
    )

    # Group the logs by topic_id and fetch the last 5 for each topic
    results_by_topic = {}
    for log in topic_logs:
        if log.topic_id not in results_by_topic:
            results_by_topic[log.topic_id] = []
        if len(results_by_topic[log.topic_id]) < 5:
            results_by_topic[log.topic_id].append({
                "assessment_id": log.assessment_id,
                "topic_id": log.topic_id,
                "topic_name": log.topic.name,
                "score": log.score,
                "logged_at": log.logged_at
            })

    # Format the response
    return [
        {
            "topic_id": topic_id,
            "topic_name": logs[0]["topic_name"] if logs else None,
            "last_5_assessments": logs
        }
        for topic_id, logs in results_by_topic.items()
    ]
    
@app.get("/stats/home/")
def get_home_stats(db: Session = Depends(get_db)):
    """
    Fetch statistics for the home page:
    - Number of assessments taken
    - Number of resources completed
    - Number of topics mastered
    """
    # Assessments Taken
    assessments_taken = db.query(Assessment).count()

    # Resources Completed
    resources_completed = db.query(Resource).filter(Resource.is_completed == True).count()

    # Topics Mastered: All resources for the topic completed
    topics = db.query(Topic).all()
    topics_mastered = 0
    for topic in topics:
        total_resources = db.query(Resource).filter(Resource.topic_id == topic.id).count()
        completed_resources = db.query(Resource).filter(
            Resource.topic_id == topic.id,
            Resource.is_completed == True
        ).count()
        if total_resources > 0 and total_resources == completed_resources:
            topics_mastered += 1

    return {
        "assessments_taken": assessments_taken,
        "resources_completed": resources_completed,
        "topics_mastered": topics_mastered
    }

@app.post("/assessments/{assessment_id}/topics/log/")
def log_topic_assessment(
    assessment_id: int,
    payload: TopicAssessmentInput,
    db: Session = Depends(get_db)
):
    """
    Log the topic-specific results for an assessment.
    """
    # Check if the assessment exists
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    log = TopicAssessmentLog(
        topic_id=payload.topic_id,
        assessment_id=assessment_id,
        score=payload.score,
        logged_at=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return {
        "message": "Topic assessment logged successfully.",
        "topic_id": payload.topic_id,
        "assessment_id": assessment_id,
        "score": log.score,
        "logged_at": log.logged_at
    }
    
@app.get("/progress/resources/")
def get_resource_progress(db: Session = Depends(get_db)):
    """
    Fetch resource progress metrics.
    """
    topics = db.query(Topic).all()
    progress = []

    for topic in topics:
        total_resources = db.query(Resource).filter(Resource.topic_id == topic.id).count()
        completed_resources = db.query(Resource).filter(
            Resource.topic_id == topic.id, Resource.is_completed == True
        ).count()

        progress.append({
            "topic_id": topic.id,
            "topic_name": topic.name,
            "total_resources": total_resources,
            "completed_resources": completed_resources,
            "completion_percentage": (completed_resources / total_resources) * 100 if total_resources > 0 else 0
        })

    return progress

@app.post("/recommendations/")
def get_recommendation(topic: str, level: str):
    engine = KnowledgeBaseEngine()
    engine.reset()
    engine.declare(Recommendation(topic=topic, level=level))
    engine.run()
    recommendations = [fact["resource"] for fact in engine.facts.values() if "resource" in fact]
    return {"recommendations": recommendations}

# New Endpoints for Questions and Answers

@app.get("/questions-with-answers/")
def get_questions_with_answers(topic_id: int, db: Session = Depends(get_db)):
    """
    Fetch all questions for a given topic, including their answers.
    """
    questions = db.query(Question).filter(Question.topic_id == topic_id).all()
    response = []

    for question in questions:
        answers = db.query(Answer).filter(Answer.question_id == question.id).all()
        response.append({
            "id": question.id,
            "question_text": question.question_text,
            "difficulty_level": question.difficulty_level,
            "answers": [{"id": answer.id, "text": answer.answer_text, "is_correct": answer.is_correct} for answer in answers]
        })

    return response

@app.post("/questions/submit/")
def submit_answers(answers: dict, db: Session = Depends(get_db)):
    """
    Accepts answers from the user for each topic and calculates their level.
    Returns the whole list of recommendations as objects.
    """

    # Sort topics by level score (ascending)
    sorted_topics = sorted(answers.items(), key=lambda x: x[1])[:3]  # Top 3 worst-performing topics

    recommendations = []
    engine = KnowledgeBaseEngine()

    for topic, level in sorted_topics:
        engine.reset()
        engine.map_level_to_name(level)
        engine.declare(Recommendation(topic=topic, level=engine.level_name))
        engine.run()

        # Collect recommendations as IDs
        resource_ids = [fact["resource"] for fact in engine.facts.values() if "resource" in fact]

        # Query resources from the database by their IDs
        resources = db.query(Resource).filter(Resource.id.in_(resource_ids)).all()

        recommendations.extend([
            {
                "topic": topic,
                "level": level,
                "resource_id": resource.id,
                "resource_title": resource.title,
                "resource_type": resource.resource_type,
                "resource_url": resource.url,
                "resource_description": resource.description,
                "resource_difficulty": resource.difficulty_level
            } for resource in resources
        ])

    return recommendations


#chatbot endpoints

# Input model for the chat
class ChatInput(BaseModel):
    message: str

# Output model for the chat
class ChatResponse(BaseModel):
    response: str

@app.post("/chat/send/", response_model=ChatResponse)
def send_message(payload: ChatInput, db: Session = Depends(get_db)):
    """
    Process the user's message and return a chatbot response.
    """
    user_message = payload.message.lower()

    # Handle recommendation requests
    if "recommend" in user_message or "suggest" in user_message:
        resources_completed = db.query(Resource).filter(Resource.is_completed == True).count()
        topics = db.query(Topic).all()
        if resources_completed < len(topics) * 2:  # Example threshold
            response = "Based on your progress, I recommend taking an assessment to identify areas for improvement. Go to the Smart Recommendations page to take your next assessment."
        else:
            response = "You've made good progress! Keep exploring resources or let me know if you'd like a specific recommendation."

    # Handle explanations by directing the user to the resources page
    elif "explain" in user_message:
        response = (
            "To learn more about this concept, please visit the Resources page for helpful materials and exercises."
        )

    # Handle progress summary
    elif "progress" in user_message:
        resources_completed = db.query(Resource).filter(Resource.is_completed == True).count()
        assessments_taken = db.query(Assessment).count()
        topics_mastered = sum(
            1 for topic in db.query(Topic).all()
            if db.query(Resource).filter(Resource.topic_id == topic.id, Resource.is_completed == True).count()
            == db.query(Resource).filter(Resource.topic_id == topic.id).count()
        )

        response = (
            f"You've completed {resources_completed} resources, taken {assessments_taken} assessments, "
            f"and mastered {topics_mastered} topics. Keep up the good work!"
        )

    # Handle unknown inputs
    else:
        response = (
            "I'm not sure I understand. Try asking for a recommendation, an explanation, "
            "or a progress summary. I'm here to help!"
        )

    return {"response": response}

