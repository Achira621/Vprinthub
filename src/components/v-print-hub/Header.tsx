'use client';
import { VPrintIcon } from "@/components/icons";
import { getWalletBalance } from "@/lib/actions";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        getWalletBalance().then(setBalance);
    }, []);

    return (
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <div className="container max-w-screen-xl mx-auto flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <VPrintIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                        V-Print Hub
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                        {balance !== null ? `₹${balance.toFixed(2)}` : '...'}
                    </span>
                </div>
            </div>
        </header>
    );
}
