"use client";

import { useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, Info } from 'lucide-react';
import { askDocumentQuestion } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button suppressHydrationWarning type="submit" disabled={pending} className="whitespace-nowrap button-glow transition-all duration-300 transform hover:scale-105">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Ask AI
        </Button>
    );
}

export function ContextualQA() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(askDocumentQuestion, { answer: '' });

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent"/>
                    Contextual Q&A
                </CardTitle>
                <CardDescription>Ask questions about your uploaded document.</CardDescription>
            </CardHeader>
            <form ref={formRef} action={async (formData) => {
                formAction(formData);
                formRef.current?.reset();
            }}>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            suppressHydrationWarning
                            name="question"
                            placeholder="e.g., What is the file size?"
                            required
                            className="bg-black/20 border-white/20 placeholder:text-muted-foreground/70"
                        />
                        <SubmitButton />
                    </div>

                    {state.error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {state.answer && (
                        <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                            <p className="font-semibold text-primary">Answer:</p>
                            <p className="text-foreground/90">{state.answer}</p>
                        </div>
                    )}
                </CardContent>
            </form>
             <CardFooter>
                <Alert variant="default" className="text-xs bg-black/20 border-white/10 text-muted-foreground">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-foreground/90">Demo Note</AlertTitle>
                    <AlertDescription>
                        This AI uses placeholder content about document properties for its answers, not the actual content of your uploaded file.
                    </AlertDescription>
                </Alert>
            </CardFooter>
        </Card>
    );
}
