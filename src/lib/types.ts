export type PrintJobStatus = 'awaiting-payment' | 'processing' | 'completed' | 'failed';

export type PaperSize = 'A4' | 'Letter';

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
};

export type TimeSlotBooking = {
    id: string;
    userId: string; // In a real app, this would be the logged-in user's ID
    date: Date;
    timeSlot: string;
    createdAt: Date;
};
