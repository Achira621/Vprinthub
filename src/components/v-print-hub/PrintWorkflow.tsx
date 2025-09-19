'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createPrintJob, payForPrintJob } from '@/lib/actions';
import { PaperSize, PrintJob } from '@/lib/types';
import { UploadCloud, FileText, Wallet, Loader2, QrCode, CalendarClock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeDialog } from './QRCodeDialog';
import { format } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const printConfigSchema = z.object({
  copies: z.coerce.number().min(1, 'At least 1 copy').max(100, 'Max 100 copies'),
  pages: z.coerce.number().min(1, 'At least 1 page').max(500, 'Max 500 pages'),
  isColor: z.boolean(),
  paperSize: z.enum(['A4', 'Letter']),
});

type PrintConfig = z.infer<typeof printConfigSchema>;

type WorkflowStep = 'upload' | 'configure' | 'payment';


function PrintWorkflowComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const slotParam = searchParams.get('slot');

  const [step, setStep] = useState<WorkflowStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [cost, setCost] = useState(0);
  const [activeJob, setActiveJob] = useState<PrintJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const { toast } = useToast();

  const bookedDate = dateParam ? new Date(dateParam) : null;
  const bookedSlot = slotParam;

  useEffect(() => {
    if (!bookedDate || !bookedSlot) {
        router.replace('/dashboard/book-slot');
        toast({
            variant: 'destructive',
            title: 'No Time Slot Selected',
            description: 'Please book a time slot before configuring your print job.',
        });
    }
  }, [bookedDate, bookedSlot, router, toast]);

  const { control, watch, handleSubmit, formState: { errors } } = useForm<PrintConfig>({
    resolver: zodResolver(printConfigSchema),
    defaultValues: { copies: 1, pages: 10, isColor: false, paperSize: 'A4' },
  });

  const configValues = watch();

  const calculateCost = ({ copies, pages, isColor }: PrintConfig) => {
    const baseCostPerPage = 2; // ₹2 per page B&W
    const colorPremium = isColor ? 8 : 0; // ₹8 extra for color (total ₹10)
    return (baseCostPerPage + colorPremium) * pages * copies;
  };

  useEffect(() => {
    setCost(calculateCost(configValues));
  }, [configValues]);
  
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
        if (selectedFile.size > MAX_FILE_SIZE) {
            toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a file smaller than 5MB.' });
            return;
        }
        if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
            toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload a PDF or Word document.' });
            return;
        }
        setFile(selectedFile);
        setStep('configure');
    }
  };

  const onConfigureSubmit = async (data: PrintConfig) => {
    if (!file || !bookedDate || !bookedSlot) return;
    setIsSubmitting(true);
    try {
      const jobData = { 
          ...data, 
          fileName: file.name, 
          cost: calculateCost(data),
          bookedDate,
          bookedSlot
      };
      const newJob = await createPrintJob(jobData);
      setActiveJob(newJob);
      setStep('payment');
      toast({ title: 'Job Created', description: 'Please proceed with payment.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create print job.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiPayment = () => {
    if (!activeJob) return;
    setIsQrVisible(true);
  };

  const handleWalletPayment = async () => {
    if (!activeJob) return;
    setIsSubmitting(true);
    try {
      const result = await payForPrintJob(activeJob.id, 'wallet');
      if (result.success) {
        toast({
          title: 'Payment Successful!',
          description: 'Your print job is now being processed.',
        });
        resetWorkflow();
      } else {
        toast({ variant: 'destructive', title: 'Payment Failed', description: result.message });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred during payment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onQrDialogClose = async () => {
    setIsQrVisible(false);
    if (!activeJob) return;
    setIsSubmitting(true);
    try {
        const result = await payForPrintJob(activeJob.id, 'upi');
        if (result.success) {
            toast({ title: 'Payment Confirmed!', description: 'Your print job is being processed.' });
            resetWorkflow();
        } else {
            toast({ variant: 'destructive', title: 'Payment Failed', description: 'Could not confirm UPI payment.' });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'An error occurred during payment confirmation.' });
    } finally {
        setIsSubmitting(false);
    }
  };


  const resetWorkflow = () => {
    router.push('/dashboard');
  };
  
  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  };

  if (!bookedDate || !bookedSlot) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <Card className="overflow-hidden glass-card">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {step === 'upload' && (
            <div>
              <CardHeader>
                <CardTitle>Step 2: Upload Your Document</CardTitle>
                <CardDescription>
                    Your time slot is <span className="text-primary font-bold">{format(bookedDate, "PPP")} at {bookedSlot}</span>. Now, upload your document.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label 
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-lg hover:border-primary hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFileChange(e.dataTransfer.files[0]);
                    }}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground mb-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
                  <p className="font-semibold">Drag & drop or <span className="text-primary">browse files</span></p>
                  <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                  <input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept={ACCEPTED_FILE_TYPES.join(',')} />
                </label>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" asChild className="border-white/20 hover:bg-white/10">
                    <Link href="/dashboard/book-slot">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Change Time Slot
                    </Link>
                </Button>
              </CardFooter>
            </div>
          )}

          {step === 'configure' && file && (
            <form onSubmit={handleSubmit(onConfigureSubmit)}>
              <CardHeader>
                <CardTitle>Step 3: Configure Your Print</CardTitle>
                <CardDescription>Adjust the settings for your document.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-md border border-white/10">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium truncate">{file.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="copies">Copies</Label>
                    <Controller name="copies" control={control} render={({ field }) => <Input {...field} id="copies" type="number" className="bg-black/20 border-white/20" />} />
                    {errors.copies && <p className="text-destructive text-sm">{errors.copies.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pages">Number of Pages</Label>
                    <Controller name="pages" control={control} render={({ field }) => <Input {...field} id="pages" type="number" className="bg-black/20 border-white/20" />} />
                    {errors.pages && <p className="text-destructive text-sm">{errors.pages.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                        <Label htmlFor="paperSize">Paper Size</Label>
                        <Controller name="paperSize" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="paperSize" className="bg-black/20 border-white/20"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A4">A4</SelectItem>
                                    <SelectItem value="Letter">Letter</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border border-white/20 h-10 mt-6 bg-black/20">
                        <Label htmlFor="isColor">Color Printing</Label>
                        <Controller name="isColor" control={control} render={({ field }) => <Switch id="isColor" checked={field.value} onCheckedChange={field.onChange} />} />
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-black/20 p-4">
                <div className="text-lg font-bold">
                    Cost: <span className="text-primary">₹{cost.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={() => setStep('upload')} className="border-white/20 hover:bg-white/10">Back</Button>
                    <Button type="submit" disabled={isSubmitting} className="button-glow">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Proceed to Payment"}
                    </Button>
                </div>
              </CardFooter>
            </form>
          )}

          {step === 'payment' && activeJob && (
             <div>
                <CardHeader>
                  <CardTitle>Step 4: Complete Your Payment</CardTitle>
                  <CardDescription>Your print job is ready. Pay to start printing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-lg space-y-2 border border-white/10">
                    <div className="flex justify-between"><span className="text-muted-foreground">Document:</span> <span className="font-semibold">{activeJob.fileName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Copies:</span> <span className="font-semibold">{activeJob.copies}</span></div>
                     <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/10">
                        <span className="text-muted-foreground flex items-center gap-2"><CalendarClock className="h-4 w-4"/> Booked Slot:</span>
                        <span className="font-semibold text-primary">{format(activeJob.bookedDate, 'EEE, h:mm a')}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold pt-2">
                      <span>Total:</span> <span className="text-primary">₹{activeJob.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 p-4">
                    <Button size="lg" className="w-full button-glow" onClick={handleUpiPayment} disabled={isSubmitting}>
                        <QrCode className="mr-2 h-5 w-5"/> Pay with UPI
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full bg-white/10 hover:bg-white/20" onClick={handleWalletPayment} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <><Wallet className="mr-2 h-5 w-5"/> Pay from Wallet</>}
                    </Button>
                    <Button variant="ghost" onClick={resetWorkflow} disabled={isSubmitting} className="mt-2 text-muted-foreground hover:text-foreground">Cancel Order</Button>
                </CardFooter>
                
                {isQrVisible && (
                    <QRCodeDialog 
                        job={activeJob}
                        open={isQrVisible} 
                        onClose={onQrDialogClose}
                    />
                )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

export const PrintWorkflow = () => (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <PrintWorkflowComponent />
    </Suspense>
);
