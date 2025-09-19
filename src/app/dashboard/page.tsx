import { Header } from '@/components/v-print-hub/Header';
import { PrintWorkflow } from '@/components/v-print-hub/PrintWorkflow';
import { PrintJobsTracker } from '@/components/v-print-hub/PrintJobsTracker';
import { ContextualQA } from '@/components/v-print-hub/ContextualQA';
import { getPrintJobs } from '@/lib/actions';
import { DashboardSidebar } from '@/components/v-print-hub/DashboardSidebar';
import { VPrintIcon } from '@/components/icons';

export default async function VPrintHubPage() {
  const initialJobs = await getPrintJobs();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00000d] via-[#02001c] to-[#00000d] animate-gradient-xy"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-blue-500/10 blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-purple-500/10 blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <DashboardSidebar />

      <div className="flex flex-col flex-1 md:ml-64 relative z-10">
        <Header />
        <main className="flex-1 w-full p-4 md:p-6 lg:p-8 grid gap-6 md:gap-8 grid-cols-1 xl:grid-cols-5">
            <div className="xl:col-span-3 flex flex-col gap-8">
              <PrintWorkflow />
            </div>
            <div className="xl:col-span-2 flex flex-col gap-8">
              <PrintJobsTracker initialJobs={initialJobs} />
              <ContextualQA />
            </div>
        </main>
      </div>
    </div>
  );
}