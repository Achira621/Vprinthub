'use server';

import { revalidatePath } from 'next/cache';
import { PrintJob, TimeSlotBooking, PrintJobData } from './types';
import { contextualDocumentQA, ContextualDocumentQAInput } from '@/ai/flows/contextual-document-qa';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';


// Simulate network latency
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to convert Firestore Timestamps to Dates in objects
function convertTimestamps<T>(docData: any): T {
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        }
    }
    return data as T;
}


export async function getPrintJobs(): Promise<PrintJob[]> {
  await sleep(200);
  const jobsCollection = collection(db, 'jobs');
  const q = query(jobsCollection); // In a real app, you'd filter by user ID
  const querySnapshot = await getDocs(q);
  const jobs: PrintJob[] = [];
  querySnapshot.forEach((doc) => {
    jobs.push(convertTimestamps<PrintJob>({ id: doc.id, ...doc.data() }));
  });
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createPrintJob(data: Omit<PrintJob, 'id' | 'status' | 'createdAt'> & { bookedDate: Date; bookedSlot: string }): Promise<PrintJob> {
  await sleep(500);

  const { bookedDate, bookedSlot, ...jobData } = data;

  const newJobData = {
    ...jobData,
    status: 'awaiting-payment',
    createdAt: Timestamp.fromDate(new Date()),
    bookedDate: Timestamp.fromDate(bookedDate),
    bookedSlot: bookedSlot,
  };

  const docRef = await addDoc(collection(db, 'jobs'), newJobData);
  
  revalidatePath('/dashboard');
  return {
    id: docRef.id,
    ...convertTimestamps<PrintJobData>(newJobData)
  };
}

export async function payForPrintJob(jobId: string, method: 'wallet' | 'upi'): Promise<{ success: boolean, message: string }> {
  await sleep(1000);
  const jobRef = doc(db, 'jobs', jobId);
  
  try {
    const jobDoc = await getDoc(jobRef);
    if (!jobDoc.exists()) {
        return { success: false, message: 'Print job not found.' };
    }
    const job = jobDoc.data() as PrintJobData;

    if (method === 'wallet') {
        const walletRef = doc(db, 'wallets', 'user-123-wallet'); // Hardcoded for demo
        await runTransaction(db, async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists() || walletDoc.data().balance < job.cost) {
                throw new Error('Insufficient wallet balance.');
            }
            const newBalance = walletDoc.data().balance - job.cost;
            transaction.update(walletRef, { balance: newBalance });
            transaction.update(jobRef, { status: 'processing' });
        });
    } else {
        await updateDoc(jobRef, { status: 'processing' });
    }

    revalidatePath('/dashboard');

    setTimeout(async () => {
        const completedJobRef = doc(db, 'jobs', jobId);
        await updateDoc(completedJobRef, { status: 'completed' });
        revalidatePath('/dashboard');
    }, 5000);

    return { success: true, message: 'Payment successful!' };

  } catch (error: any) {
    return { success: false, message: error.message || 'An error occurred during payment.' };
  }
}

export async function getWalletBalance(): Promise<number> {
    await sleep(150);
    const walletRef = doc(db, 'wallets', 'user-123-wallet'); // Hardcoded wallet for demo
    const docSnap = await getDoc(walletRef);

    if (docSnap.exists()) {
        return docSnap.data().balance;
    } else {
        // Create wallet if it doesn't exist for the demo
        await addDoc(collection(db, "wallets"), {
            balance: 500.00,
            userId: 'user-123'
        });
        return 500.00;
    }
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

  const bookingsCollection = collection(db, 'bookings');
  const q = query(
      bookingsCollection,
      where('bookedDate', '==', Timestamp.fromDate(new Date(data.date.setHours(0,0,0,0)))),
      where('timeSlot', '==', data.timeSlot)
  );
  
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return { success: false, message: 'This time slot is already booked. Please choose another.' };
  }

  const newBooking: Omit<TimeSlotBooking, 'id'> = {
    userId: 'user-123', // Placeholder user ID
    date: Timestamp.fromDate(data.date),
    timeSlot: data.timeSlot,
    createdAt: Timestamp.fromDate(new Date()),
  };

  await addDoc(bookingsCollection, newBooking);
  
  return { success: true, message: 'Slot booked successfully!' };
}
