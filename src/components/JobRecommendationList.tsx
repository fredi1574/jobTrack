"use client";
import { addRecommendedApplication } from "@/app/actions/application";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

interface JobRecommendation {
  company: string;
  position: string;
  location: string;
  url: string;
  description: string;
}

export default function JobRecommendationList() {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/recommendations");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch recommendations");
        }
        const data: JobRecommendation[] = await response.json();
        setRecommendations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const handleAddApplication = async (job: JobRecommendation) => {
    const result = await addRecommendedApplication({
      company: job.company,
      position: job.position,
      location: job.location,
      url: job.url,
      notes: job.description,
    });
    if (result.success) {
      toast.success("Application added successfully!");
    } else {
      toast.error(result.error || "Failed to add application");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className={undefined}>
            <CardHeader className={undefined}>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className={undefined}>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-gray-500">
        No job recommendations available yet. Apply to more jobs to get
        personalized recommendations!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((job, index) => (
        <Card key={index} className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>{job.position}</CardTitle>
            <p className="text-sm text-gray-500">
              {job.company} - {job.location}
            </p>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="mb-4 text-sm">{job.description}</p>
            <div className="flex justify-between gap-2">
              {job.url && (
                <Button
                  asChild
                  variant="outline"
                  className={undefined}
                  size={undefined}
                >
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    Apply
                  </a>
                </Button>
              )}
              <Button
                onClick={() => handleAddApplication(job)}
                className={undefined}
                variant={undefined}
                size={undefined}
              >
                Add to My Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
