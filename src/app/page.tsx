'use client';

import { ArrowRight, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VPrintIcon } from '@/components/icons';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <VPrintIcon className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl">V-Print</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link href="#showcase" className="text-sm font-medium hover:text-primary transition-colors">Showcase</Link>
            <Link href="#specs" className="text-sm font-medium hover:text-primary transition-colors">Specs</Link>
          </nav>
          <Button asChild>
            <Link href="/login">
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section 
          className="container mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tighter" variants={fadeIn}>
            Printing. <br /> Reimagined.
          </motion.h1>
          <motion.p className="mt-4 max-w-xl text-lg text-muted-foreground" variants={fadeIn}>
            Seamless, wireless, and brilliant quality printing for the modern campus. Welcome to the future.
          </motion.p>
          <motion.div variants={fadeIn} className="mt-8">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* About Section */}
        <motion.section id="about" className="py-20 md:py-32 bg-secondary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger}
        >
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-4xl font-bold tracking-tight">Radical Simplicity</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                We believe printing should be effortless. V-Print strips away the complexities—no drivers, no cables, no hassle. Just pure, uninterrupted workflow from your device to the printer.
              </p>
            </motion.div>
            <motion.div className="relative h-64 md:h-80" variants={fadeIn}>
                <Image src="https://picsum.photos/seed/printer/600/400" alt="Minimalist printer design" layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint="minimalist printer" />
            </motion.div>
          </div>
        </motion.section>

        {/* Showcase Section */}
        <motion.section id="showcase" className="py-20 md:py-32"
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
              <motion.div variants={fadeIn} className="bg-secondary p-8 rounded-lg text-left">
                <h3 className="text-2xl font-bold">Glyph Interface</h3>
                <p className="mt-2 text-muted-foreground">Intuitive light patterns provide notifications for print status, errors, and low paper levels.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-secondary p-8 rounded-lg text-left">
                <h3 className="text-2xl font-bold">V-Print OS</h3>
                <p className="mt-2 text-muted-foreground">A clean, bloat-free operating system ensures fast processing and reliable connections.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-secondary p-8 rounded-lg text-left">
                <h3 className="text-2xl font-bold">Sustainable Build</h3>
                <p className="mt-2 text-muted-foreground">Made from 100% recycled aluminum and plastics, designed for longevity.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Tech Specs Section */}
        <motion.section id="specs" className="py-20 md:py-32 bg-secondary"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={stagger}
        >
          <div className="container mx-auto">
            <motion.h2 className="text-4xl font-bold tracking-tight text-center" variants={fadeIn}>Tech Specs</motion.h2>
            <motion.div className="mt-12 max-w-2xl mx-auto" variants={fadeIn}>
              <div className="flow-root">
                <div className="-my-4 divide-y divide-border">
                  <div className="flex items-center justify-between py-4">
                    <p className="font-medium">Connectivity</p>
                    <p className="text-muted-foreground">Wi-Fi 6, Bluetooth 5.3, NFC</p>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <p className="font-medium">Print Speed</p>
                    <p className="text-muted-foreground">Up to 22 ppm (B&W), 18 ppm (Color)</p>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <p className="font-medium">Resolution</p>
                    <p className="text-muted-foreground">4800 x 1200 dpi</p>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <p className="font-medium">Paper Capacity</p>
                    <p className="text-muted-foreground">150 sheets</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 gap-4">
          <div className="flex items-center gap-2">
            <VPrintIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} V-Print. All Rights Reserved.</span>
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
