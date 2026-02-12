import { useState } from 'react';
import { useDeleteTip } from '../../hooks/queries/useTipMutations';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import type { FoodPreservationTip } from '../../backend';

interface TipDetailPanelProps {
  tip: FoodPreservationTip;
  onClose: () => void;
  onEdit: (tip: FoodPreservationTip) => void;
}

export default function TipDetailPanel({ tip, onClose, onEdit }: TipDetailPanelProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteTip = useDeleteTip();

  const handleDelete = async () => {
    try {
      await deleteTip.mutateAsync(tip.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete tip:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onClose} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tips
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-2xl">{tip.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(tip)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{tip.content}</p>
          </div>

          {tip.tags && tip.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created: {new Date(Number(tip.createdAt) / 1000000).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Updated: {new Date(Number(tip.updatedAt) / 1000000).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tip?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tip.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
