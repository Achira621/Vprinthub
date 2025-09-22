"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPrintJobs } from '@/lib/actions';
import { PrintJob, PrintJobStatus } from '@/lib/types';
import { Clock, Loader2, CheckCircle, AlertTriangle, FileText, RefreshCw, CalendarClock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const statusConfig: Record<PrintJobStatus, { icon: React.ReactElement, text: string, badge: "default" | "secondary" | "destructive" | "outline", glow: string }> = {
  'awaiting-payment': { icon: <Clock className="text-yellow-400" />, text: 'Awaiting Payment', badge: 'outline', glow: 'shadow-yellow-500/30' },
  'processing': { icon: <Loader2 className="text-blue-400 animate-spin" />, text: 'Processing', badge: 'secondary', glow: 'shadow-blue-500/40' },
  'completed': { icon: <CheckCircle className="text-green-400" />, text: 'Completed', badge: 'default', glow: 'shadow-green-500/50' },
  'failed': { icon: <AlertTriangle className="text-red-400" />, text: 'Failed', badge: 'destructive', glow: 'shadow-red-500/40' },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="glass-card flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='space-y-1.5'>
            <CardTitle>Print Queue</CardTitle>
            <CardDescription>Real-time status of your print jobs.</CardDescription>
        </div>
        <Button suppressHydrationWarning variant="ghost" size="icon" onClick={fetchJobs} disabled={isLoading} className="hover:bg-white/10">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {jobs.length > 0 ? (
          <ul className="space-y-3">
             <AnimatePresence>
                {jobs.map((job) => (
                <motion.li 
                    key={job.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 p-3 bg-black/20 rounded-lg border border-white/10 transition-shadow hover:shadow-lg"
                >
                    <div className={`mt-1 h-5 w-5 flex items-center justify-center rounded-full shadow-sm ${statusConfig[job.status].glow}`}>
                        {statusConfig[job.status].icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold truncate pr-2">{job.fileName}</p>
                            <Badge variant={statusConfig[job.status].badge} className="capitalize text-xs">
                                {statusConfig[job.status].text}
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
                         <div className="text-xs text-primary/80 flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Slot: {format(job.bookedDate, 'EEE, h:mm a')}
                        </div>
                    </div>
                </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 border-2 border-dashed border-white/10 rounded-lg h-full">
            <FileText className="w-10 h-10 text-muted-foreground/50 mb-4" />
            <p className="font-semibold text-foreground/80">No Print Jobs Yet</p>
            <p className="text-sm text-muted-foreground">Upload a document to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
