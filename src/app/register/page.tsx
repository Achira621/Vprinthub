'use client';

import { useState } from 'react';
import { VPrintIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: 'Passwords do not match.',
            });
            return;
        }
        setIsLoading(true);
        try {
            await register(email, password);
            toast({ title: 'Registration Successful', description: 'Welcome! You are now logged in.' });
            router.push('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: error.message || 'An error occurred during registration.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative">
             <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00000d] via-[#02001c] to-[#00000d] animate-gradient-xy"></div>
                <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-blue-500/10 blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-purple-500/10 blur-3xl animate-blob animation-delay-4000"></div>
            </div>
            <Card className="w-full max-w-sm glass-card z-10">
                <form onSubmit={handleRegister}>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <VPrintIcon className="h-10" />
                        </div>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>Join V-Print Hub to start printing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="student@college.edu" required className="bg-black/20 border-white/20" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required className="bg-black/20 border-white/20" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" required className="bg-black/20 border-white/20" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full button-glow" disabled={isLoading}>
                             {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                        </Button>
                         <p className="text-xs text-center text-muted-foreground">
                            Already have an account? <Link href="/login" className="underline text-primary">Log In</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
