
import { Header } from '@/components/v-print-hub/Header';
import { PrintWorkflow } from '@/components/v-print-hub/PrintWorkflow';
import { PrintJobsTracker } from '@/components/v-print-hub/PrintJobsTracker';
import { ContextualQA } from '@/components/v-print-hub/ContextualQA';
import { getPrintJobs } from '@/lib/actions';
import { DashboardSidebar } from '@/components/v-print-hub/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import Link from 'next/link';

export default async function VPrintHubPage() {
  const initialJobs = await getPrintJobs();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
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
        </main>
      </div>
    </div>
  );
}
