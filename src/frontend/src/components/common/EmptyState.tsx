import { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  illustration?: string;
}

export default function EmptyState({ title, description, action, illustration }: EmptyStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {illustration && (
          <img src={illustration} alt="" className="w-32 h-auto mb-6 opacity-60" />
        )}
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
