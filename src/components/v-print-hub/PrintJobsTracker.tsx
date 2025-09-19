"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPrintJobs } from '@/lib/actions';
import { PrintJob, PrintJobStatus } from '@/lib/types';
import { Clock, Loader2, CheckCircle, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const statusIcons: Record<PrintJobStatus, React.ReactElement> = {
  'awaiting-payment': <Clock className="text-yellow-500" />,
  'processing': <Loader2 className="text-primary animate-spin" />,
  'completed': <CheckCircle className="text-green-500" />,
  'failed': <AlertTriangle className="text-destructive" />,
};

const statusText: Record<PrintJobStatus, string> = {
    'awaiting-payment': 'Awaiting Payment',
    'processing': 'Processing',
    'completed': 'Completed',
    'failed': 'Failed',
  };

export function PrintJobsTracker({ initialJobs }: { initialJobs: PrintJob[] }) {
  const [jobs, setJobs] = useState<PrintJob[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
        const updatedJobs = await getPrintJobs();
        setJobs(updatedJobs);
    } catch (error) {
        console.error("Failed to fetch jobs", error);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(fetchJobs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='space-y-1.5'>
            <CardTitle>Print Queue</CardTitle>
            <CardDescription>Real-time status of your print jobs.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchJobs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="flex items-start gap-4 p-3 bg-secondary/50 rounded-lg">
                <div className="mt-1">{statusIcons[job.status]}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold truncate pr-2">{job.fileName}</p>
                    <Badge variant={job.status === 'completed' ? 'default' : 'secondary'} className="capitalize bg-primary/10 text-primary-foreground">
                        {statusText[job.status]}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-between mt-1">
                    <span>
                        {job.copies} {job.copies > 1 ? 'copies' : 'copy'} &bull; ₹{job.cost.toFixed(2)}
                    </span>
                    <span className='text-xs'>
                        {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <FileText className="w-10 h-10 text-muted-foreground/50 mb-4" />
            <p className="font-semibold">No Print Jobs Yet</p>
            <p className="text-sm text-muted-foreground">Upload a document to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
