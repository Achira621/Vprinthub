'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { add, format, isPast } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bookTimeSlot } from '@/lib/actions';
import { cn } from '@/lib/utils';

// Generate time slots for a given day
const generateTimeSlots = (date: Date) => {
  const slots = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // Start at 9:00 AM

  for (let i = 0; i < 36; i++) { // 9 hours * 4 slots/hour
    const slotTime = add(startOfDay, { minutes: i * 15 });
    if (isPast(slotTime) && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        continue; // Don't show past slots for today
    }
    slots.push(format(slotTime, 'HH:mm'));
  }
  return slots;
};


export default function BookSlotPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const timeSlots = date ? generateTimeSlots(date) : [];

  const handleBooking = async () => {
    if (!date || !selectedSlot) {
      toast({
        variant: 'destructive',
        title: 'Selection Missing',
        description: 'Please select a date and a time slot.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bookTimeSlot({ date, timeSlot: selectedSlot });
      if (result.success) {
        toast({
          title: 'Slot Booked!',
          description: `Your printing slot for ${format(date, 'PPP')} at ${selectedSlot} is confirmed.`,
        });
        setSelectedSlot(null); // Reset selection
      } else {
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="glass-card max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="text-primary" />
            Book a Printing Slot
          </CardTitle>
          <CardDescription>
            Reserve a time to use a campus printer. This helps avoid queues.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date() || d > add(new Date(), {days: 14})}
              className="rounded-md border bg-black/20"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5"/>
                Available Slots for {date ? format(date, 'PPP') : '...'}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-2">
                {timeSlots.length > 0 ? timeSlots.map((slot) => (
                    <Button
                        key={slot}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className={cn(
                            "border-white/20 hover:bg-white/10",
                            selectedSlot === slot && 'button-glow'
                        )}
                        onClick={() => setSelectedSlot(slot)}
                    >
                        {slot}
                    </Button>
                )) : <p className="text-muted-foreground col-span-4">Please select a valid date.</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-black/20 p-4 flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center sm:text-left">
                {selectedSlot && date ? (
                    <p>Selected Slot: <span className="font-bold text-primary">{format(date, "do MMMM")} at {selectedSlot}</span></p>
                ) : (
                    <p className="text-muted-foreground">Select a date and time to book your slot.</p>
                )}
            </div>
          <Button onClick={handleBooking} disabled={!selectedSlot || !date || isSubmitting} className="w-full sm:w-auto button-glow">
            {isSubmitting ? 'Booking...' : 'Book Slot'}
            <Check className="ml-2 h-4 w-4"/>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
