"use client";

import { useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, Info } from 'lucide-react';
import { askDocumentQuestion } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="whitespace-nowrap">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Ask AI
        </Button>
    );
}

export function ContextualQA() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(askDocumentQuestion, { answer: '' });

    return (
        <Card>
            <form ref={formRef} action={async (formData) => {
                formAction(formData);
                formRef.current?.reset();
            }}>
                <CardHeader>
                    <CardTitle>Contextual Q&A</CardTitle>
                    <CardDescription>Ask questions about your uploaded document.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            name="question"
                            placeholder="e.g., What is the file size?"
                            required
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
                        <div className="p-4 bg-secondary rounded-lg">
                            <p className="font-semibold text-foreground">Answer:</p>
                            <p className="text-muted-foreground">{state.answer}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Alert variant="default" className="text-xs">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Demo Note</AlertTitle>
                        <AlertDescription>
                            This AI uses placeholder content about document properties for its answers, not the actual content of your uploaded file.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            </form>
        </Card>
    );
}
