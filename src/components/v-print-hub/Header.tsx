'use client';
import { getWalletBalance } from "@/lib/actions";
import { Wallet, Search, User, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

export function Header() {
    const [balance, setBalance] = useState<number | null>(null);
    const prevBalanceRef = useRef<number | null>(null);
    const balanceSpanRef = useRef<HTMLSpanElement>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchBalance = () => {
            getWalletBalance().then(newBalance => {
                prevBalanceRef.current = balance;
                setBalance(newBalance);
            });
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 5000);
        return () => clearInterval(interval);
    }, [user, balance]);

    useEffect(() => {
        if (balance !== null && prevBalanceRef.current !== null && balance !== prevBalanceRef.current && balanceSpanRef.current) {
            const span = balanceSpanRef.current;
            span.animate([
                { transform: 'translateY(-5px) scale(1.1)', color: 'hsl(var(--primary))' },
                { transform: 'translateY(0) scale(1)', color: 'hsl(var(--foreground))' }
            ], {
                duration: 400,
                easing: 'ease-out'
            });
        }
    }, [balance]);

    return (
        <header className="sticky top-0 z-20 bg-secondary/30 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center justify-between p-4 h-20">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10" suppressHydrationWarning>
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-secondary/60 backdrop-blur-xl border-r-white/10 w-72">
                            <DashboardSidebar />
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-2xl font-bold text-foreground hidden md:block">
                        Dashboard
                    </h1>
                </div>


                <div className="flex items-center gap-2 sm:gap-4">
                     <div className="relative flex-1 max-w-xs hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input suppressHydrationWarning placeholder="Search..." className="pl-10 bg-black/20 border-white/20 placeholder:text-muted-foreground/70" />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-black/20 border border-white/10">
                        <Wallet className="w-5 h-5 text-primary" />
                        <span ref={balanceSpanRef} className="font-semibold text-foreground tabular-nums transition-colors duration-300 text-sm sm:text-base">
                            {balance !== null ? `₹${balance.toFixed(2)}` : '...'}
                        </span>
                    </div>

                    <Avatar>
                        <AvatarImage src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`} alt={user?.displayName || 'User'} />
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
