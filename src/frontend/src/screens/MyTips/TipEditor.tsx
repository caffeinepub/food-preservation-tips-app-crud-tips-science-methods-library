import { useState, useEffect } from 'react';
import { useCreateTip, useUpdateTip } from '../../hooks/queries/useTipMutations';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { X, Loader2, Plus } from 'lucide-react';
import type { FoodPreservationTip } from '../../backend';

interface TipEditorProps {
  tip: FoodPreservationTip | null;
  onClose: () => void;
}

export default function TipEditor({ tip, onClose }: TipEditorProps) {
  const [title, setTitle] = useState(tip?.title || '');
  const [content, setContent] = useState(tip?.content || '');
  const [tags, setTags] = useState<string[]>(tip?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const createTip = useCreateTip();
  const updateTip = useUpdateTip();

  const isEditing = !!tip;
  const mutation = isEditing ? updateTip : createTip;

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing) {
        await updateTip.mutateAsync({
          id: tip.id,
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : null,
        });
      } else {
        await createTip.mutateAsync({
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : null,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save tip:', error);
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Tip' : 'New Tip'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update your preservation tip' : 'Share your food preservation knowledge'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder="e.g., Freezing Fresh Herbs in Olive Oil"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) setErrors({ ...errors, content: undefined });
                }}
                placeholder="Describe your preservation method, tips, or observations..."
                rows={8}
                className={errors.content ? 'border-destructive' : ''}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                />
                <Button type="button" onClick={addTag} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Tip'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
