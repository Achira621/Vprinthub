'use server';
/**
 * @fileOverview A contextual document question answering AI agent.
 *
 * - contextualDocumentQA - A function that answers questions about a document.
 * - ContextualDocumentQAInput - The input type for the contextualDocumentQA function.
 * - ContextualDocumentQAOutput - The return type for the contextualDocumentQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualDocumentQAInputSchema = z.object({
  documentContent: z.string().describe('The content of the document as a string.'),
  question: z.string().describe('The question to be answered about the document.'),
});
export type ContextualDocumentQAInput = z.infer<typeof ContextualDocumentQAInputSchema>;

const ContextualDocumentQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the document.'),
});
export type ContextualDocumentQAOutput = z.infer<typeof ContextualDocumentQAOutputSchema>;

export async function contextualDocumentQA(input: ContextualDocumentQAInput): Promise<ContextualDocumentQAOutput> {
  return contextualDocumentQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualDocumentQAPrompt',
  input: {schema: ContextualDocumentQAInputSchema},
  output: {schema: ContextualDocumentQAOutputSchema},
  prompt: `You are an expert in understanding documents and answering questions about them. Use the document content provided to answer the question.

Document Content: {{{documentContent}}}

Question: {{{question}}}

Answer:`,
});

const contextualDocumentQAFlow = ai.defineFlow(
  {
    name: 'contextualDocumentQAFlow',
    inputSchema: ContextualDocumentQAInputSchema,
    outputSchema: ContextualDocumentQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
