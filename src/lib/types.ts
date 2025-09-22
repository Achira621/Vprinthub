import { Timestamp } from 'firebase/firestore';

export type PrintJobStatus = 'awaiting-payment' | 'processing' | 'completed' | 'failed';

export type PaperSize = 'A4' | 'Letter';

// Type for client-side use with Date objects
export type PrintJob = {
  id: string;
  fileName: string;
  copies: number;
  pages: number;
  isColor: boolean;
  paperSize: PaperSize;
  cost: number;
  status: PrintJobStatus;
  createdAt: Date;
  bookedDate: Date;
  bookedSlot: string;
};

// Type for Firestore data with Timestamp objects
export type PrintJobData = Omit<PrintJob, 'id' | 'createdAt' | 'bookedDate'> & {
  createdAt: Timestamp;
  bookedDate: Timestamp;
}

export type TimeSlotBooking = {
    id: string;
    userId: string; // In a real app, this would be the logged-in user's ID
    date: Timestamp;
    timeSlot: string;
    createdAt: Timestamp;
};
