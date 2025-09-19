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
