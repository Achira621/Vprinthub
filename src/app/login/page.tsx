import { VPrintIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative">
             <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00000d] via-[#02001c] to-[#00000d] animate-gradient-xy"></div>
                <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-blue-500/10 blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-purple-500/10 blur-3xl animate-blob animation-delay-4000"></div>
            </div>
            <Card className="w-full max-w-sm glass-card z-10">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <VPrintIcon className="h-10" />
                    </div>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="student@college.edu" required className="bg-black/20 border-white/20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required className="bg-black/20 border-white/20" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full button-glow" asChild>
                        <Link href="/dashboard">Log In</Link>
                    </Button>
                     <p className="text-xs text-center text-muted-foreground">
                        Don't have an account? <Link href="#" className="underline text-primary">Sign Up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
