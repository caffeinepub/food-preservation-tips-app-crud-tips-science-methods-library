import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, AlertTriangle, ListOrdered } from 'lucide-react';
import type { ScienceExplanation } from '../../backend';

interface ScienceMethodDetailPanelProps {
  explanation: ScienceExplanation;
  onClose: () => void;
}

export default function ScienceMethodDetailPanel({ explanation, onClose }: ScienceMethodDetailPanelProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onClose} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl">{explanation.title}</CardTitle>
            <Badge variant="outline">{explanation.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Summary</h4>
            <p className="text-foreground leading-relaxed">{explanation.summary}</p>
          </div>

          {explanation.steps && explanation.steps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                Steps
              </h4>
              <ol className="space-y-3">
                {explanation.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {explanation.safetyNotes && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong className="font-medium">Safety Notes:</strong>
                <p className="mt-1">{explanation.safetyNotes}</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
