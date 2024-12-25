'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, FileText, BarChart2, MessageCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_BASE_URL = 'http://127.0.0.1:8000';

interface Assessment {
  assessment_id: number;
  score: number;
  logged_at: string;
}

interface Resource {
  id: number;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
}

interface HomeStats {
  assessments_taken: number;
  resources_completed: number;
  topics_mastered: number;
}

// Mock data for parts we're not fetching from the API
const userData = {
  name: "Khalil",
  nextAction: "Check out the new resources in your recommended topics",
}

const features = [
  { title: "Smart Recommendations", description: "Find resources tailored to your learning needs.", icon: Brain },
  { title: "Resources", description: "Access a wide range of learning materials.", icon: FileText },
  { title: "Progress Tracker", description: "Visualize your growth and set new goals.", icon: BarChart2 },
  { title: "Chatbot", description: "Get instant help and tips for better revision.", icon: MessageCircle }
]

export default function Home() {
  const router = useRouter()
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [assessmentsResponse, resourcesResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/assessments/`),
          fetch(`${API_BASE_URL}/resources/`),
          fetch(`${API_BASE_URL}/stats/home/`)
        ])

        if (!assessmentsResponse.ok || !resourcesResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const assessments: Assessment[] = await assessmentsResponse.json()
        const resources: Resource[] = await resourcesResponse.json()
        const stats: HomeStats = await statsResponse.json()

        const recentAssessments = assessments
          .slice(-2)
          .map(assessment => `Completed assessment with score ${assessment.score}%`)

        const recentCompletedResources = resources
          .filter(resource => resource.is_completed && resource.completed_at)
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
          .slice(0, 1)
          .map(resource => `Completed resource: ${resource.title}`)

        setRecentActivity([...recentAssessments, ...recentCompletedResources].slice(-3))
        setHomeStats(stats)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTakeAssessment = () => {
    router.push('/recommendations')
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}!</h1>
        <p className="text-xl mb-4">Your journey to mastery starts here!</p>
        <Button variant="secondary" size="lg" onClick={handleTakeAssessment}>
          Take an Assessment
        </Button>
      </section>

      {/* Quick Overview */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading recent activity...</p>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <ul className="list-disc pl-5">
                {recentActivity.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Suggested Action</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userData.nextAction}</p>
            <Button className="mt-4" onClick={() => router.push('/resources')}>
              Explore Resources
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Key Features Highlight */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-8 h-8 mb-2 text-blue-600" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Your Learning Journey */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Learning Journey</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading statistics...</p>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : homeStats ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{homeStats.assessments_taken}</CardTitle>
                  <CardDescription>Assessments Taken</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{homeStats.resources_completed}</CardTitle>
                  <CardDescription>Resources Completed</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{homeStats.topics_mastered}</CardTitle>
                  <CardDescription>Topics Mastered</CardDescription>
                </CardHeader>
              </Card>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}

