'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, FileText, Brain, Check, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
//import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Resource {
  id: number;
  title: string;
  type: 'video' | 'article' | 'exercise';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  url: string;
  topic_id: number;
  is_completed: boolean;
  completed_at: string | null;
}

const API_BASE_URL = 'http://127.0.0.1:8000';
const ITEMS_PER_PAGE = 6;

const topics = ["All", "Math", "Physics", "Chemistry", "Biology", "Programming", "Data Science", "History", "Literature"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
const types = ["All", "Video", "Article", "Exercise"]

export default function ResourcesPage() {
  const [allResources, setAllResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  //const { toast } = useToast()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/resources/`)
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      const data = await response.json()
      console.log('Fetched resources:', data)
      
      if (Array.isArray(data)) {
        setAllResources(data)
      } else {
        console.error('Unexpected data structure:', data)
        setAllResources([])
        setError('Received unexpected data structure from the server')
      }
    } catch (err) {
      setError('An error occurred while fetching resources. Please try again.')
      console.error('Error fetching resources:', err)
      setAllResources([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredResources = useMemo(() => {
    return allResources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTopic === "All" || resource.topic_id === topics.indexOf(selectedTopic)) &&
      (selectedDifficulty === "All" || resource.difficulty === selectedDifficulty.toLowerCase()) &&
      (selectedType === "All" || resource.type === selectedType.toLowerCase())
    )
  }, [allResources, searchTerm, selectedTopic, selectedDifficulty, selectedType])

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredResources, currentPage])

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE)

  const redirectToResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const markResourceAsCompleted = async (resource: Resource) => {
    try {
      if (!resource || resource.is_completed) {
        setAlertMessage("This resource has already been marked as completed.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/resources/${resource.id}/complete/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark resource as completed');
      }

      const data = await response.json();
      console.log('Resource marked as completed:', data);

      // Update the local state
      setAllResources(prevResources =>
        prevResources.map(r =>
          r.id === resource.id
            ? { ...r, is_completed: true, completed_at: data.completed_at }
            : r
        )
      );

      // Show confirmation alert
      setAlertMessage(`"${resource.title}" has been successfully marked as completed.`);

      // Close the confirmation dialog
      setIsConfirmOpen(false);
      setSelectedResource(null);
    } catch (err) {
      console.error('Error marking resource as completed:', err);
      setAlertMessage("Failed to mark the resource as completed. Please try again.");
    }
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const icons = {
      video: <Video className="w-6 h-6" />,
      article: <FileText className="w-6 h-6" />,
      exercise: <Brain className="w-6 h-6" />,
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icons[resource.type]}
            {resource.title}
          </CardTitle>
          <CardDescription>{topics[resource.topic_id]} - {resource.difficulty}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{resource.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="default" 
            onClick={() => redirectToResource(resource.url)}
          >
            View Resource
          </Button>
          {resource.is_completed ? (
            <Button variant="secondary" disabled>
              <Check className="mr-2 h-4 w-4" /> Completed
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedResource(resource);
                setIsConfirmOpen(true);
              }}
            >
              Mark as Completed
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {alertMessage && (
        <Alert className="mb-4">
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setAlertMessage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>{topic}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-center">Loading resources...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          {paginatedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paginatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <p className="text-center">No resources found.</p>
          )}

          {filteredResources.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 bg-gray-100 rounded">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this resource as completed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button onClick={() => selectedResource && markResourceAsCompleted(selectedResource)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

