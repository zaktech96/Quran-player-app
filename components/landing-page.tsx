'use client';

import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  const features = [
    {
      title: "Read Quran",
      description: "Access the complete Quran with clear Arabic text and translations",
      icon: <BookOpen className="w-8 h-8" />,
      link: "/quran"
    },
    {
      title: "Listen to Recitations",
      description: "Experience beautiful recitations from renowned Qaris",
      icon: <Headphones className="w-8 h-8" />,
      link: "/quran"
    },
    {
      title: "Multiple Translations",
      description: "Read translations in various languages to understand better",
      icon: <Globe className="w-8 h-8" />,
      link: "/quran"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/40 via-background to-background" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container relative mx-auto px-4">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Welcome Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-green-200/50 to-green-100/50 backdrop-blur-sm">
                  <span className="px-6 py-2 rounded-full bg-white/80 text-sm font-medium text-green-800">
                    Welcome to Digital Quran
                  </span>
                </div>
              </motion.div>

              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-b from-green-800 via-green-700 to-green-600 text-transparent bg-clip-text">
                Experience the Holy Quran<br />in the Digital Age
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Immerse yourself in the divine words with beautiful recitations,<br />
                precise translations, and a modern reading experience
              </p>

              <div className="flex items-center justify-center space-x-4">
                <Link href="/quran">
                  <Button 
                    size="lg" 
                    className="bg-green-700 hover:bg-green-800 text-lg px-8 py-6 rounded-full group"
                  >
                    Start Reading
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 rounded-full border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={feature.link}>
                    <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-green-100 hover:border-green-200 bg-white/50 backdrop-blur-sm">
                      <div className="space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <div className="text-green-700">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold mb-3 text-green-800">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
