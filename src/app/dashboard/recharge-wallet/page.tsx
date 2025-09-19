'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Download, RefreshCw, QrCode } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const qrSchema = z.object({
  upiId: z.string().min(3, 'UPI ID is required').regex(/@/, 'Invalid UPI ID format'),
  payeeName: z.string().min(1, 'Payee Name is required'),
  amount: z.coerce.number().min(1, 'Amount is required'),
  note: z.string().optional(),
});

type QrFormValues = z.infer<typeof qrSchema>;

export default function RechargeWalletPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [upiLink, setUpiLink] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QrFormValues>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      upiId: 'your-upi-id@okhdfcbank',
      payeeName: 'V-Print Hub',
      note: 'Wallet Recharge'
    }
  });

  const generateQrCode = (data: QrFormValues) => {
    const { upiId, payeeName, amount, note } = data;
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
    });
    if (amount) {
      params.set('am', amount.toString());
    }
    if (note) {
      params.set('tn', note);
    }
    params.set('cu', 'INR'); // Currency code for Indian Rupee

    const upiUrl = `upi://pay?${params.toString()}`;
    setUpiLink(upiUrl);

    const encodedUpiUrl = encodeURIComponent(upiUrl);
    const googleQrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedUpiUrl}&choe=UTF-8`;
    setQrCodeUrl(googleQrUrl);

    toast({
      title: 'QR Code Generated!',
      description: 'Scan the QR code to add funds to your wallet.',
    });
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    // We use a CORS proxy to allow downloading the image from Google Charts
    link.href = `https://images.weserv.nl/?url=${encodeURIComponent(qrCodeUrl.replace('https://',''))}`;
    link.download = 'upi-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setQrCodeUrl(null);
    setUpiLink(null);
    reset();
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="text-primary" />
            Recharge Wallet
          </CardTitle>
          <CardDescription>
            Generate a QR code to add funds to your V-Print wallet via UPI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!qrCodeUrl ? (
            <form onSubmit={handleSubmit(generateQrCode)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="upiId">Recipient UPI ID</Label>
                <Input id="upiId" {...register('upiId')} className="bg-black/20 border-white/20" />
                {errors.upiId && <p className="text-sm text-destructive">{errors.upiId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="payeeName">Recipient Name</Label>
                <Input id="payeeName" {...register('payeeName')} className="bg-black/20 border-white/20" />
                {errors.payeeName && <p className="text-sm text-destructive">{errors.payeeName.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (INR)</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="100.00" {...register('amount')} className="bg-black/20 border-white/20" />
                   {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input id="note" {...register('note')} className="bg-black/20 border-white/20" />
                </div>
              </div>
              <Button type="submit" className="w-full button-glow">
                <QrCode className="mr-2" />
                Generate QR Code
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <Image
                  src={qrCodeUrl}
                  alt="Generated UPI QR Code for wallet recharge"
                  width={250}
                  height={250}
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={handleDownload} className='button-glow'>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleReset} variant="outline" className="border-white/20 hover:bg-white/10">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
            <Alert variant="default" className="text-xs bg-black/20 border-white/10 text-muted-foreground">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-foreground/90">How it Works</AlertTitle>
                <AlertDescription>
                    We construct a UPI deep link and encode it into a QR code. When you scan it, your UPI app prefills the payment details for a quick and easy transaction. Your wallet will be updated after payment is confirmed.
                </AlertDescription>
            </Alert>
        </CardFooter>
      </Card>
    </div>
  );
}
