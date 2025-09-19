'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PrintJob } from '@/lib/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

type QRCodeDialogProps = {
  job: PrintJob;
  open: boolean;
  onClose: () => void;
};

export function QRCodeDialog({ job, open, onClose }: QRCodeDialogProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            // Construct a UPI payment string
            const upiString = `upi://pay?pa=your-upi-id@okhdfcbank&pn=V-Print%20Hub&tid=${job.id}&am=${job.cost.toFixed(2)}&cu=INR&tn=Print%20Job%20${job.id}`;
            const encodedUpiString = encodeURIComponent(upiString);
            
            // Use Google Charts API to generate QR code
            const qrApiUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodedUpiString}&choe=UTF-8`;

            setQrCodeUrl(qrApiUrl);
            
            // Simulate loading time for QR code generation
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [open, job]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>Scan to Pay with UPI</DialogTitle>
          <DialogDescription>
            Scan the QR code with your favorite UPI app to complete the payment of ₹{job.cost.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 min-h-[282px]">
            {isLoading ? (
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            ) : (
                <Image
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    width={250}
                    height={250}
                    className="rounded-lg bg-white p-2"
                />
            )}
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <p className="text-xs text-muted-foreground text-center">
                After successful payment, your print job will be processed automatically.
            </p>
          <Button onClick={onClose} className="w-full button-glow">
            I Have Paid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
