'use client';
import { VPrintIcon } from "@/components/icons";
import { getWalletBalance } from "@/lib/actions";
import { Wallet, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
    const [balance, setBalance] = useState<number | null>(null);

    const fetchBalance = () => {
        getWalletBalance().then(setBalance);
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 5000); // Poll for balance updates
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <div className="container max-w-screen-xl mx-auto flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <VPrintIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                        Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary">
                    <Wallet className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground tabular-nums">
                        {balance !== null ? `₹${balance.toFixed(2)}` : '...'}
                    </span>
                </div>
            </div>
        </header>
    );
}
