'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Video, FileText, Brain } from 'lucide-react'

interface Topic {
  id: number;
  name: string;
  description: string;
}

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_text: string;
  difficulty_level: string;
  answers: Answer[];
  topic_id: number;
}

interface Recommendation {
  topic: string;
  level: number;
  resource_id: number;
  resource_title: string;
  resource_type: 'video' | 'article' | 'exercise';
  resource_url: string;
  resource_description: string;
  resource_difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TopicProgress {
  totalQuestions: number;
  answeredCorrectly: number;
}

const API_BASE_URL = 'http://127.0.0.1:8000';
const TOTAL_TOPICS = 8;
const MAX_QUESTIONS_PER_TOPIC = 4;

const topicsArray = ["All", "Math", "Physics", "Chemistry", "Biology", "Programming", "Data Science", "History", "Literature"]
const difficultiesArray = ["All", "Beginner", "Intermediate", "Advanced"]
const typesArray = ["All", "Video", "Article", "Exercise"]

const calculateOverallScore = (scores: Record<string, number>): number => {
  const validScores = Object.values(scores).filter(score => score !== null);
  return validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0;
};

export default function SmartRecommendations() {
  const [stage, setStage] = useState<'intro' | 'questionnaire' | 'results' | 'error'>('intro');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/topics/`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      let allQuestions: Question[] = [];
      const progressData: TopicProgress[] = new Array(TOTAL_TOPICS).fill(null).map(() => ({ totalQuestions: 0, answeredCorrectly: 0 }));
      
      for (let i = 1; i <= TOTAL_TOPICS; i++) {
        const response = await fetch(`${API_BASE_URL}/questions-with-answers/?topic_id=${i}`);
        const data: Question[] = await response.json();
        if (data.length > 0) {
          const topicQuestions = data.slice(0, MAX_QUESTIONS_PER_TOPIC).map(q => ({ ...q, topic_id: i }));
          allQuestions = [...allQuestions, ...topicQuestions];
          progressData[i - 1] = { totalQuestions: topicQuestions.length, answeredCorrectly: 0 };
        }
      }
      setQuestions(allQuestions);
      setTopicProgress(progressData); // Call once after constructing the data
    } catch (error) {
      console.error('Error fetching questions:', error);
      setStage('intro');
    }
  };

  const handleStartAssessment = async () => {
    setIsLoading(true);
    await fetchQuestions();
    setStage('questionnaire');
    setIsLoading(false);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
  
    const question = questions[currentQuestion];
    const isCorrect = answer === question.answers.find(a => a.is_correct)?.text;
  
    // Update topic progress only if needed
    setTopicProgress(prevProgress => {
      const newProgress = [...prevProgress];
      const topicIndex = question.topic_id - 1;
  
      if (topicIndex >= 0 && topicIndex < newProgress.length && isCorrect) {
        newProgress[topicIndex] = {
          ...newProgress[topicIndex],
          answeredCorrectly: newProgress[topicIndex].answeredCorrectly + 1, // Increment correctly
        };
      }
      return newProgress;
    });
  
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      if (questions[nextQuestion].topic_id !== questions[currentQuestion].topic_id) {
        setCurrentTopic(questions[nextQuestion].topic_id);
      }
    } else {
      calculateScores();
    }
  };

  const calculateScores = () => {
    const scores: Record<string, number> = {};
    topicProgress.forEach((progress, index) => {
      const topic = topics[index].name;
      if (progress.totalQuestions > 0) {
        scores[topic] = progress.answeredCorrectly / progress.totalQuestions;
      } else {
        scores[topic] = null;
      }
    });

    const filteredScores = Object.fromEntries(
      Object.entries(scores).filter(([_, score]) => score !== null)
    );

    submitScores(filteredScores);
  };

  const submitScores = async (scores: Record<string, number>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate and log overall score
      const calculatedOverallScore = Math.round(calculateOverallScore(scores) * 100);
      setOverallScore(calculatedOverallScore);

      // Prepare data for overall assessment log
      const overallAssessmentData = { score: calculatedOverallScore };

      // Log overall assessment
      const assessmentResponse = await fetch(`${API_BASE_URL}/assessments/log/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(overallAssessmentData),
      });

      if (!assessmentResponse.ok) {
        throw new Error(`HTTP error! status: ${assessmentResponse.status}`);
      }

      const assessmentData = await assessmentResponse.json();

      // Log topic-specific scores
      for (const [topic, score] of Object.entries(scores)) {
        if (score !== null) {
          const topicId = topicsArray.indexOf(topic);
          if (topicId !== -1) {
            const topicScore = Math.round(score * 100);
            const topicData = { topic_id: topicId, score: topicScore };

            const topicResponse = await fetch(`${API_BASE_URL}/assessments/${assessmentData.assessment_id}/topics/log/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(topicData),
            });

            if (!topicResponse.ok) {
              throw new Error(`HTTP error! status: ${topicResponse.status}`);
            }

            const topicResponseData = await topicResponse.json();
          } else {
            console.log(`Skipping topic ${topic} as it's not found in topicsArray`);
          }
        } else {
          console.log(`Skipping topic ${topic} as the score is null`);
        }
      }

      // Fetch recommendations

      const recommendationsResponse = await fetch(`${API_BASE_URL}/questions/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
      });

      if (!recommendationsResponse.ok) {
        throw new Error(`HTTP error! status: ${recommendationsResponse.status}`);
      }

      const recommendationsData = await recommendationsResponse.json();

      if (Array.isArray(recommendationsData)) {
        setRecommendations(recommendationsData);
      } else {
        console.error('Unexpected recommendations data structure:', recommendationsData);
        setRecommendations([]);
      }

      setStage('results');
    } catch (err) {
      console.error('Error in submitScores:', err);
      setError('An error occurred while submitting scores. Please try again.');
      setOverallScore(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderIntro = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Smart Recommendations</CardTitle>
        <CardDescription>Answer questions from various topics to determine your learning needs</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleStartAssessment}>Start Assessment</Button>
      </CardContent>
    </Card>
  );

  const renderQuestion = () => {
    if (questions.length === 0) {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <p>Loading questions...</p>
          </CardContent>
        </Card>
      );
    }

    const question = questions[currentQuestion];
    const topic = topics.find(t => t.id === question.topic_id);
    const topicQuestions = questions.filter(q => q.topic_id === question.topic_id);
    const currentTopicQuestionIndex = topicQuestions.findIndex(q => q.id === question.id) + 1;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{topic?.name || 'Unknown Topic'}</CardTitle>
          <CardDescription>
            Topic {currentTopic} of {TOTAL_TOPICS} | 
            Question {currentTopicQuestionIndex} of {topicQuestions.length} for this topic | 
            Overall: {currentQuestion + 1} of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{question.question_text}</p>
          <div className="space-y-2">
            {question.answers.map((answer) => (
              <Button
                key={answer.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAnswer(answer.text)}
              >
                {answer.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
    const icons = {
      video: <Video className="w-6 h-6" />,
      article: <FileText className="w-6 h-6" />,
      exercise: <Brain className="w-6 h-6" />,
    };

    return (
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center space-x-4">
          {icons[recommendation.resource_type]}
          <div>
            <CardTitle className="text-lg">{recommendation.resource_title}</CardTitle>
            <CardDescription>{recommendation.topic} - {recommendation.resource_difficulty}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{recommendation.resource_description}</p>
          <Button variant="outline" asChild>
            <a href={recommendation.resource_url} target="_blank" rel="noopener noreferrer">
              View Resource
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    if (!recommendations || recommendations.length === 0) {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>No Recommendations</CardTitle>
            <CardDescription>We couldn't generate recommendations based on your results.</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    const groupedRecommendations = recommendations.reduce((acc, rec) => {
      if (!acc[rec.resource_type]) {
        acc[rec.resource_type] = [];
      }
      acc[rec.resource_type].push(rec);
      return acc;
    }, {} as Record<string, Recommendation[]>);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>Here's how you performed in your assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {overallScore !== null && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
                <div className="text-3xl font-bold text-blue-600">{overallScore}%</div>
              </div>
            )}
            <h3 className="text-lg font-semibold mb-2">Topic-wise Performance</h3>
            {topicProgress.map((progress, index) => {
              if (!progress) return null;
              const topic = topics[index]?.name || `Topic ${index + 1}`;
              const score = progress.answeredCorrectly / progress.totalQuestions;
              return (
                <div key={topic} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{topic}</span>
                    <span>{progress.answeredCorrectly} / {progress.totalQuestions} ({Math.round(score * 100)}%)</span>
                  </div>
                  <Progress value={score * 100} />
                </div>
              );
            })}
          </CardContent>
        </Card>
        {Object.entries(groupedRecommendations).map(([type, recs]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Recommendations</CardTitle>
              <CardDescription>Based on your performance, we recommend these {type}s</CardDescription>
            </CardHeader>
            <CardContent>
              {recs.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderError = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>An error occurred: {error}</p>
        <Button onClick={() => setStage('intro')} className="mt-4">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      {isLoading ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {stage === 'intro' && renderIntro()}
          {stage === 'questionnaire' && renderQuestion()}
          {stage === 'results' && renderResults()}
          {stage === 'error' && renderError()}
        </>
      )}
    </div>
  );
}

