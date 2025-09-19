import { Header } from '@/components/v-print-hub/Header';
import { PrintWorkflow } from '@/components/v-print-hub/PrintWorkflow';
import { PrintJobsTracker } from '@/components/v-print-hub/PrintJobsTracker';
import { ContextualQA } from '@/components/v-print-hub/ContextualQA';
import { getPrintJobs } from '@/lib/actions';

export default async function VPrintHubPage() {
  const initialJobs = await getPrintJobs();

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full max-w-screen-xl mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-5 items-start">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <PrintWorkflow />
            <ContextualQA />
          </div>
          <div className="lg:col-span-2">
            <PrintJobsTracker initialJobs={initialJobs} />
          </div>
        </div>
      </main>
    </div>
  );
}
