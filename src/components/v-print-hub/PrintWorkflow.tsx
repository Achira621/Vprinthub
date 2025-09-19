"use client";

import { useState, useEffect } from 'react';
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
import { UploadCloud, FileText, Printer, Wallet, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export function PrintWorkflow() {
  const [step, setStep] = useState<WorkflowStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [cost, setCost] = useState(0);
  const [activeJob, setActiveJob] = useState<PrintJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { control, watch, handleSubmit, formState: { errors } } = useForm<PrintConfig>({
    resolver: zodResolver(printConfigSchema),
    defaultValues: { copies: 1, pages: 10, isColor: false, paperSize: 'A4' },
  });

  const configValues = watch();

  const calculateCost = ({ copies, pages, isColor }: PrintConfig) => {
    const baseCostPerPage = 5; // ₹5 per page
    const colorPremium = isColor ? 10 : 0; // ₹10 extra for color
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
    if (!file) return;
    setIsSubmitting(true);
    try {
      const jobData = { ...data, fileName: file.name, cost: calculateCost(data) };
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

  const handlePayment = async (method: 'wallet' | 'upi') => {
    if (!activeJob) return;
    setIsSubmitting(true);
    try {
      const result = await payForPrintJob(activeJob.id, method);
      if (result.success) {
        toast({
          title: 'Payment Successful!',
          description: 'Your print job is now being processed.',
          action: <div className="p-2 bg-green-500 text-white rounded-full"><CheckCircle className="h-5 w-5"/></div>,
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

  const resetWorkflow = () => {
    setFile(null);
    setStep('upload');
    setActiveJob(null);
  };
  
  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <Card className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {step === 'upload' && (
            <div>
              <CardHeader>
                <CardTitle>Start a New Print Job</CardTitle>
                <CardDescription>Upload your document to begin.</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFileChange(e.dataTransfer.files[0]);
                    }}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="font-semibold">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">or</p>
                  <Button variant="link" asChild>
                    <label htmlFor="file-upload">
                        click to browse
                        <input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept={ACCEPTED_FILE_TYPES.join(',')} />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </CardContent>
            </div>
          )}

          {step === 'configure' && file && (
            <form onSubmit={handleSubmit(onConfigureSubmit)}>
              <CardHeader>
                <CardTitle>Configure Your Print</CardTitle>
                <CardDescription>Adjust the settings for your document.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-md">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium truncate">{file.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="copies">Copies</Label>
                    <Controller name="copies" control={control} render={({ field }) => <Input {...field} id="copies" type="number" />} />
                    {errors.copies && <p className="text-destructive text-sm">{errors.copies.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pages">Number of Pages</Label>
                    <Controller name="pages" control={control} render={({ field }) => <Input {...field} id="pages" type="number" />} />
                    {errors.pages && <p className="text-destructive text-sm">{errors.pages.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                        <Label htmlFor="paperSize">Paper Size</Label>
                        <Controller name="paperSize" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="paperSize"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A4">A4</SelectItem>
                                    <SelectItem value="Letter">Letter</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border h-10 mt-6">
                        <Label htmlFor="isColor">Color Printing</Label>
                        <Controller name="isColor" control={control} render={({ field }) => <Switch id="isColor" checked={field.value} onCheckedChange={field.onChange} />} />
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-secondary/50">
                <div className="text-lg font-bold">
                    Estimated Cost: <span className="text-primary">₹{cost.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={resetWorkflow}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Proceed to Payment"}
                    </Button>
                </div>
              </CardFooter>
            </form>
          )}

          {step === 'payment' && activeJob && (
             <div>
                <CardHeader>
                  <CardTitle>Complete Your Payment</CardTitle>
                  <CardDescription>Your print job is ready. Pay to start printing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Document:</span> <span className="font-semibold">{activeJob.fileName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Copies:</span> <span className="font-semibold">{activeJob.copies}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Pages:</span> <span className="font-semibold">{activeJob.pages * activeJob.copies}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Print Type:</span> <span className="font-semibold">{activeJob.isColor ? 'Color' : 'Black & White'}</span></div>
                  </div>
                  <div className="text-2xl font-bold text-center py-4">
                    Total Amount: <span className="text-primary">₹{activeJob.cost.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={() => handlePayment('upi')} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <><Printer className="mr-2"/> Pay with UPI</>}
                    </Button>
                    <Button size="lg" className="w-full" onClick={() => handlePayment('wallet')} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <><Wallet className="mr-2"/> Pay from Wallet</>}
                    </Button>
                    <Button variant="ghost" onClick={resetWorkflow} disabled={isSubmitting}>Cancel Order</Button>
                </CardFooter>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
