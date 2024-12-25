'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE_URL = 'http://127.0.0.1:8000';

interface Assessment {
  assessment_id: number;
  score: number;
  logged_at: string;
}

interface TopicAssessment {
  assessment_id: number;
  topic_id: number;
  topic_name: string;
  score: number;
  logged_at: string;
}

interface TopicAssessmentHistory {
  topic_id: number;
  topic_name: string;
  last_5_assessments: TopicAssessment[];
}

interface ResourceProgress {
  topic_id: number;
  topic_name: string;
  total_resources: number;
  completed_resources: number;
  completion_percentage: number;
}

export default function ProgressTracker() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [topicAssessmentHistory, setTopicAssessmentHistory] = useState<TopicAssessmentHistory[]>([]);
  const [resourceProgress, setResourceProgress] = useState<ResourceProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [assessmentsResponse, resourceProgressResponse, topicAssessmentHistoryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/assessments/`),
          fetch(`${API_BASE_URL}/progress/resources/`),
          fetch(`${API_BASE_URL}/assessments/topics/last5/all/`)
        ]);

        if (!assessmentsResponse.ok || !resourceProgressResponse.ok || !topicAssessmentHistoryResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const assessmentsData: Assessment[] = await assessmentsResponse.json();
        const resourceProgressData: ResourceProgress[] = await resourceProgressResponse.json();
        const topicAssessmentHistoryData: TopicAssessmentHistory[] = await topicAssessmentHistoryResponse.json();

        setAssessments(assessmentsData);
        setResourceProgress(resourceProgressData);
        setTopicAssessmentHistory(topicAssessmentHistoryData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalResources = resourceProgress.reduce((sum, topic) => sum + topic.total_resources, 0);
  const totalCompletedResources = resourceProgress.reduce((sum, topic) => sum + topic.completed_resources, 0);
  const overallCompletionPercentage = totalResources > 0 ? (totalCompletedResources / totalResources) * 100 : 0;

  const TopicAssessmentHistoryComponent = ({ topicHistory }: { topicHistory: TopicAssessmentHistory }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{topicHistory.topic_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment ID</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topicHistory.last_5_assessments.map((assessment) => (
              <TableRow key={assessment.assessment_id}>
                <TableCell>{assessment.assessment_id}</TableCell>
                <TableCell>{assessment.score}%</TableCell>
                <TableCell>{new Date(assessment.logged_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-center mt-8">Loading progress data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
      <p className="text-gray-600 mb-6">Track your progress across resources and assessments.</p>

      {/* Resource Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resource Progress</CardTitle>
          <CardDescription>Your progress in completing learning resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Completion Overview</h3>
            <p className="mb-2">
              {totalCompletedResources} out of {totalResources} resources completed
              ({Math.round(overallCompletionPercentage)}%)
            </p>
            <Progress value={overallCompletionPercentage} className="w-full" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Topic-Wise Progress</h3>
            {resourceProgress.map((topic) => (
              <div key={topic.topic_id} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span>{topic.topic_name}</span>
                  <span>{Math.round(topic.completion_percentage)}%</span>
                </div>
                <Progress value={topic.completion_percentage} className="w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Progress</CardTitle>
          <CardDescription>Your performance in assessments over time</CardDescription>
        </CardHeader>
        <CardContent>
          {assessments.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Assessment Overview</h3>
                <p>Latest assessment score: {assessments[assessments.length - 1].score}%</p>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Performance Over Time</h3>
                <div className="overflow-x-auto">
                  <ChartContainer
                    config={{
                      score: {
                        label: "Score",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px] min-w-[600px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={assessments}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="logged_at" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="var(--color-score)" name="Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
              {topicAssessmentHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Topic-Specific Assessment History</h3>
                  <Tabs defaultValue={topicAssessmentHistory[0].topic_id.toString()} className="w-full">
                    <TabsList className="mb-4">
                      {topicAssessmentHistory.map((topic) => (
                        <TabsTrigger key={topic.topic_id} value={topic.topic_id.toString()}>
                          {topic.topic_name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {topicAssessmentHistory.map((topic) => (
                      <TabsContent key={topic.topic_id} value={topic.topic_id.toString()}>
                        <TopicAssessmentHistoryComponent topicHistory={topic} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}
            </>
          ) : (
            <p>No assessment data available yet. Complete an assessment to see your progress.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

