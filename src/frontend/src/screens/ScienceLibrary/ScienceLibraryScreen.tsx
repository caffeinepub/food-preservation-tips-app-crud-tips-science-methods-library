import { useState } from 'react';
import { useGetAllScienceExplanations } from '../../hooks/queries/useScienceLibrary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ScienceMethodDetailPanel from './ScienceMethodDetailPanel';
import type { ScienceExplanation } from '../../backend';

export default function ScienceLibraryScreen() {
  const { data: explanations, isLoading, error, refetch } = useGetAllScienceExplanations();
  const [selectedExplanation, setSelectedExplanation] = useState<ScienceExplanation | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  if (selectedExplanation) {
    return (
      <ScienceMethodDetailPanel
        explanation={selectedExplanation}
        onClose={() => setSelectedExplanation(null)}
      />
    );
  }

  if (!explanations || explanations.length === 0) {
    return (
      <EmptyState
        title="No science methods available"
        description="The science library is currently empty. Check back later for preservation methods and explanations."
        illustration="/assets/generated/icons-set.dim_384x128.png"
      />
    );
  }

  // Group by category
  const categories = Array.from(new Set(explanations.map((e) => e.category)));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Science Library</h2>
        <p className="text-muted-foreground mt-1">
          Explore {explanations.length} science-backed preservation methods
        </p>
      </div>

      {categories.map((category) => {
        const categoryExplanations = explanations.filter((e) => e.category === category);
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {category}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryExplanations.map((explanation) => (
                <Card
                  key={explanation.id.toString()}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedExplanation(explanation)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2">{explanation.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0">
                        {explanation.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3">{explanation.summary}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
