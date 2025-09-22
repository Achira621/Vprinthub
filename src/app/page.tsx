'use client';

import { ArrowRight, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VPrintIcon } from '@/components/icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <VPrintIcon className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="#get-started" className="text-sm font-medium hover:text-primary transition-colors">Get Started</Link>
          </nav>
          <Button asChild className="button-glow transition-all duration-300 transform hover:scale-105">
            <Link href="/login">
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section 
          className="container mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32 relative"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/50 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/50 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tighter" variants={fadeIn}>
            Printing. <br /> Reimagined.
          </motion.h1>
          <motion.p className="mt-4 max-w-xl text-lg text-muted-foreground" variants={fadeIn}>
            Seamless, wireless, and brilliant quality printing for the modern campus. Welcome to the future.
          </motion.p>
          <motion.div variants={fadeIn} className="mt-8">
            <Button size="lg" asChild className="button-glow transition-all duration-300 transform hover:scale-105">
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* About Section */}
        <motion.section id="about" className="py-20 md:py-32 bg-secondary/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger}
        >
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-4xl font-bold tracking-tight">Radical Simplicity</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                We believe printing should be effortless. V-Print strips away the complexities—no drivers, no cables, no hassle. Just pure, uninterrupted workflow from your device to any printer on campus.
              </p>
            </motion.div>
            <motion.div className="relative h-64 md:h-80" variants={fadeIn}>
                <Image src="https://picsum.photos/seed/abstract/600/400" alt="Abstract futuristic graphic" layout="fill" objectFit="cover" className="rounded-lg opacity-70" data-ai-hint="abstract futuristic" />
                 <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section id="features" className="py-20 md:py-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={stagger}
        >
          <div className="container mx-auto text-center">
            <motion.h2 className="text-4xl font-bold tracking-tight" variants={fadeIn}>Brilliant by Design</motion.h2>
            <motion.p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg" variants={fadeIn}>
              Engineered for excellence. Every detail is optimized for a seamless experience.
            </motion.p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="glass-card p-8 rounded-lg text-left transition-transform transform hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-primary">Cloud-Powered</h3>
                <p className="mt-2 text-muted-foreground">Upload your documents from anywhere and print them on any connected printer.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="glass-card p-8 rounded-lg text-left transition-transform transform hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-primary">Pay & Go</h3>
                <p className="mt-2 text-muted-foreground">A simple and secure wallet system to pay for your print jobs instantly.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="glass-card p-8 rounded-lg text-left transition-transform transform hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-primary">Real-time Tracking</h3>
                <p className="mt-2 text-muted-foreground">Monitor your print queue and get live status updates on all your jobs.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Get Started Section */}
        <motion.section id="get-started" className="py-20 md:py-32 bg-secondary/50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={stagger}
        >
          <div className="container mx-auto text-center">
            <motion.h2 className="text-4xl font-bold tracking-tight" variants={fadeIn}>Ready to Print?</motion.h2>
            <motion.p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg" variants={fadeIn}>
              Create an account and start printing in minutes. It's that easy.
            </motion.p>
             <motion.div variants={fadeIn} className="mt-8">
                <Button size="lg" asChild className="button-glow transition-all duration-300 transform hover:scale-105">
                    <Link href="/login">
                        Sign Up Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 gap-4">
          <div className="flex items-center gap-2">
            <VPrintIcon className="h-5 text-muted-foreground" />
            {year && <span className="text-sm text-muted-foreground">&copy; {year} V-Print. All Rights Reserved.</span>}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Dot/>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
