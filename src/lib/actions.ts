'use server';

import { revalidatePath } from 'next/cache';
import { PrintJob, TimeSlotBooking } from './types';
import { contextualDocumentQA, ContextualDocumentQAInput } from '@/ai/flows/contextual-document-qa';

// In-memory store to simulate a database
let jobs: PrintJob[] = [];
let bookings: TimeSlotBooking[] = [];
let walletBalance = 500.00;


// Simulate network latency
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPrintJobs(): Promise<PrintJob[]> {
  await sleep(200);
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createPrintJob(data: Omit<PrintJob, 'id' | 'status' | 'createdAt'>): Promise<PrintJob> {
  await sleep(500);
  const newJob: PrintJob = {
    ...data,
    id: `job-${Date.now()}`,
    status: 'awaiting-payment',
    createdAt: new Date(),
  };

  jobs.unshift(newJob);
  revalidatePath('/dashboard');
  return newJob;
}

export async function payForPrintJob(jobId: string, method: 'wallet' | 'upi'): Promise<{ success: boolean, message: string }> {
  await sleep(1000);
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
  
  // With a real UPI integration, a webhook would update the status.
  // Here, we just move it to processing.
  job.status = 'processing';
  revalidatePath('/dashboard');

  // Simulate job completion after a delay
  setTimeout(() => {
    const completedJob = jobs.find(j => j.id === jobId);
    if(completedJob) {
        completedJob.status = 'completed';
        revalidatePath('/dashboard');
    }
  }, 10000 + Math.random() * 5000); // 10-15 second processing time

  return { success: true, message: 'Payment successful!' };
}

export async function getWalletBalance(): Promise<number> {
    await sleep(150);
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
      // NOTE: For this demo, we're using placeholder text instead of extracting from a file.
      documentContent: "V-Print Hub is a modern printing solution. The document has a file size of 2.4 MB, with 1-inch margins on all sides. It uses 12pt Times New Roman font across its 15 pages, ensuring clarity and legibility.",
      question,
    };
    
    const result = await contextualDocumentQA(input);
    return { answer: result.answer };

  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while communicating with the AI. Please try again.' };
  }
}

export async function bookTimeSlot(data: { date: Date; timeSlot: string }): Promise<{ success: boolean; message: string }> {
  await sleep(700);

  const existingBooking = bookings.find(
    (b) => b.date.toDateString() === data.date.toDateString() && b.timeSlot === data.timeSlot
  );

  if (existingBooking) {
    return { success: false, message: 'This time slot is already booked. Please choose another.' };
  }

  const newBooking: TimeSlotBooking = {
    id: `booking-${Date.now()}`,
    userId: 'user-123', // Placeholder user ID
    date: data.date,
    timeSlot: data.timeSlot,
    createdAt: new Date(),
  };

  bookings.push(newBooking);
  console.log('Current Bookings:', bookings);

  return { success: true, message: 'Slot booked successfully!' };
}
