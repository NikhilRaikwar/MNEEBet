'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function ErrorDisplay({ title = 'Error', message, action }: ErrorDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {action && <CardContent>{action}</CardContent>}
    </Card>
  );
}
