import { useState } from 'react';
import { useGetUserTips } from '../../hooks/queries/useMyTips';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus, Calendar } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import TipEditor from './TipEditor';
import TipDetailPanel from './TipDetailPanel';
import type { FoodPreservationTip } from '../../backend';

export default function MyTipsScreen() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: tips, isLoading, error, refetch } = useGetUserTips(principal);
  const [editingTip, setEditingTip] = useState<FoodPreservationTip | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTip, setSelectedTip] = useState<FoodPreservationTip | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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

  if (isCreating || editingTip) {
    return (
      <TipEditor
        tip={editingTip}
        onClose={() => {
          setIsCreating(false);
          setEditingTip(null);
        }}
      />
    );
  }

  if (selectedTip) {
    return (
      <TipDetailPanel
        tip={selectedTip}
        onClose={() => setSelectedTip(null)}
        onEdit={(tip) => {
          setSelectedTip(null);
          setEditingTip(tip);
        }}
      />
    );
  }

  if (!tips || tips.length === 0) {
    return (
      <EmptyState
        title="No tips yet"
        description="Start building your food preservation knowledge by adding your first tip!"
        illustration="/assets/generated/icons-set.dim_384x128.png"
        action={
          <Button onClick={() => setIsCreating(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Your First Tip
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Tips</h2>
          <p className="text-muted-foreground mt-1">
            {tips.length} {tips.length === 1 ? 'tip' : 'tips'} saved
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Tip
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <Card
            key={tip.id.toString()}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTip(tip)}
          >
            <CardHeader>
              <CardTitle className="line-clamp-2">{tip.title}</CardTitle>
              <CardDescription className="line-clamp-3">{tip.content}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {tip.tags?.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(Number(tip.createdAt) / 1000000).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
