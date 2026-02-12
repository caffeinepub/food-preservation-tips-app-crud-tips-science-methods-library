import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = 'Error', message, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-3">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
