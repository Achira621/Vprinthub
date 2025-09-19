"use client";

import Link from "next/link";
import { VPrintIcon } from "../icons";
import { LayoutDashboard, Printer, History, Settings, LogOut, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/recharge-wallet", icon: Wallet, label: "Recharge Wallet" },
    { href: "#", icon: Printer, label: "Printers" },
    { href: "#", icon: History, label: "History" },
    { href: "#", icon: Settings, label: "Settings" },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed top-0 left-0 z-30 h-screen w-64 hidden md:flex flex-col bg-secondary/30 backdrop-blur-md border-r border-white/10 p-4">
            <div className="flex items-center gap-2 p-4 mb-4">
                <VPrintIcon className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl">V-Print Hub</span>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-md text-muted-foreground transition-all hover:text-foreground hover:bg-white/5",
                            pathname === item.href && "bg-primary/10 text-primary font-semibold shadow-[inset_2px_0_0_hsl(var(--primary))]"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div>
                <Link
                    href="/"
                    className="flex items-center gap-3 p-3 rounded-md text-muted-foreground transition-all hover:text-foreground hover:bg-white/5"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
