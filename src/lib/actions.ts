"use server";

import { revalidatePath } from 'next/cache';
import { PrintJob } from './types';
import { contextualDocumentQA, ContextualDocumentQAInput } from '@/ai/flows/contextual-document-qa';

// In-memory store to simulate a database
let jobs: PrintJob[] = [
    {
        id: 'job-1',
        fileName: 'Initial-Document.pdf',
        copies: 1,
        pages: 10,
        isColor: false,
        paperSize: 'A4',
        cost: 50.00,
        status: 'completed',
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: 'job-2',
        fileName: 'Project-Proposal.docx',
        copies: 5,
        pages: 2,
        isColor: true,
        paperSize: 'Letter',
        cost: 150.00,
        status: 'processing',
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
    },
];
let walletBalance = 2500.00;


// Simulate network latency
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPrintJobs(): Promise<PrintJob[]> {
  // TODO: Replace with actual Firestore query
  // e.g., const snapshot = await db.collection('printJobs').orderBy('createdAt', 'desc').get();
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  await sleep(500);
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createPrintJob(data: Omit<PrintJob, 'id' | 'status' | 'createdAt'>): Promise<PrintJob> {
  await sleep(1000);
  const newJob: PrintJob = {
    ...data,
    id: `job-${Date.now()}`,
    status: 'awaiting-payment',
    createdAt: new Date(),
  };

  jobs.push(newJob);
  revalidatePath('/');
  return newJob;
}

export async function payForPrintJob(jobId: string, method: 'wallet' | 'upi'): Promise<{ success: boolean, message: string }> {
  await sleep(1500);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return { success: false, message: 'Print job not found.' };
  }

  if (method === 'wallet') {
    if (walletBalance < job.cost) {
      return { success: false, message: 'Insufficient wallet balance.' };
    }
    walletBalance -= job.cost;
  }
  
  // In a real app, you would have a webhook from the payment provider (like UPI)
  // that would update the job status. For now, we'll just move it to processing.
  job.status = 'processing';
  
  // Simulate job completion
  setTimeout(() => {
    const completedJob = jobs.find(j => j.id === jobId);
    if(completedJob) {
        completedJob.status = 'completed';
        revalidatePath('/');
    }
  }, 10000);

  revalidatePath('/');
  return { success: true, message: 'Payment successful! Your print job is now processing.' };
}

export async function getWalletBalance(): Promise<number> {
    await sleep(200);
    return walletBalance;
}

type AskDocumentQuestionState = {
    answer?: string;
    error?: string;
}
export async function askDocumentQuestion(prevState: AskDocumentQuestionState, formData: FormData): Promise<AskDocumentQuestionState> {
  const question = formData.get('question') as string;

  if (!question.trim()) {
    return { error: 'Please enter a question.' };
  }
  
  await sleep(1000);

  try {
    const input: ContextualDocumentQAInput = {
      // NOTE: In a real application, you would extract text from the uploaded document.
      // For this scaffold, we're using a placeholder text.
      documentContent: "V-Print Hub is a modern printing solution. The document has a file size of 2.4 MB. The margins are set to 1 inch on all sides. The content is clear and legible, using 12pt Times New Roman font. It contains 15 pages.",
      question,
    };
    
    const result = await contextualDocumentQA(input);
    return { answer: result.answer };

  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while communicating with the AI. Please try again.' };
  }
}
