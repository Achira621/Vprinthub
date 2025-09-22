import { ContextualQA } from '@/components/v-print-hub/ContextualQA';
import { getPrintJobs } from '@/lib/actions';
import { PrintJobsTracker } from '@/components/v-print-hub/PrintJobsTracker';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import Link from 'next/link';

export default async function VPrintHubPage() {
  const initialJobs = await getPrintJobs();

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 xl:grid-cols-5">
      <div className="xl:col-span-3 flex flex-col gap-8">
        <div className="text-center p-8 glass-card rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to V-Print Hub</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your one-stop solution for seamless campus printing. Book a slot, upload your document, and print. It's that simple.
          </p>
          <Button asChild size="lg" className="button-glow">
            <Link href="/dashboard/book-slot">
              <Printer className="mr-2" />
              Start a New Print Job
            </Link>
          </Button>
        </div>
        <ContextualQA />
      </div>
      <div className="xl:col-span-2 flex flex-col gap-8">
        <PrintJobsTracker initialJobs={initialJobs} />
      </div>
    </div>
  );
}
