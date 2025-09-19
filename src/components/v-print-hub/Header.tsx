'use client';
import { VPrintIcon } from "@/components/icons";
import { getWalletBalance } from "@/lib/actions";
import { Wallet, Search, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";

export function Header() {
    const [balance, setBalance] = useState<number | null>(null);
    const prevBalanceRef = useRef<number | null>(null);
    const balanceSpanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const fetchBalance = () => {
            getWalletBalance().then(newBalance => {
                prevBalanceRef.current = balance;
                setBalance(newBalance);
            });
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 5000);
        return () => clearInterval(interval);
    }, [balance]);

    useEffect(() => {
        if (balance !== null && prevBalanceRef.current !== null && balance !== prevBalanceRef.current && balanceSpanRef.current) {
            const span = balanceSpanRef.current;
            span.animate([
                { transform: 'translateY(-5px) scale(1.1)', opacity: 0.8 },
                { transform: 'translateY(0) scale(1)', opacity: 1 }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        }
    }, [balance]);

    return (
        <header className="sticky top-0 z-20 bg-secondary/30 backdrop-blur-md border-b border-white/10">
            <div className="container max-w-screen-xl mx-auto flex items-center justify-between p-4 h-20">
                <h1 className="text-2xl font-bold text-foreground hidden md:block">
                    Dashboard
                </h1>

                <div className="relative flex-1 max-w-xs ml-auto mr-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search jobs..." className="pl-10 bg-black/20 border-white/20 placeholder:text-muted-foreground/70" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 border border-white/10">
                        <Wallet className="w-5 h-5 text-primary" />
                        <span ref={balanceSpanRef} className="font-semibold text-foreground tabular-nums transition-colors duration-300">
                            {balance !== null ? `₹${balance.toFixed(2)}` : '...'}
                        </span>
                    </div>

                    <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
