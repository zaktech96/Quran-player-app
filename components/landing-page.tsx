'use client';

import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function LandingPage() {
  const features = [
    {
      title: "Read Quran",
      description: "Access the complete Quran with clear Arabic text and translations",
      icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
      link: "/quran",
      gradient: "from-emerald-400 to-green-600"
    },
    {
      title: "Listen to Recitations",
      description: "Experience beautiful recitations from renowned Qaris",
      icon: <Headphones className="w-6 h-6 md:w-8 md:h-8" />,
      link: "/quran",
      gradient: "from-green-400 to-teal-600"
    },
    {
      title: "Multiple Translations",
      description: "Read translations in various languages to understand better",
      icon: <Globe className="w-6 h-6 md:w-8 md:h-8" />,
      link: "/quran",
      gradient: "from-teal-400 to-emerald-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#FCFCFC] to-green-50/30 dark:from-gray-950 dark:to-green-950/30">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/40 via-background to-background dark:from-green-900/10 dark:via-gray-950 dark:to-gray-950" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-200/20 dark:bg-green-900/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-200/20 dark:bg-green-900/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-pulse" />
          </div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Enhanced Welcome Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8 md:mb-10"
              >
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-green-200/50 to-emerald-100/50 dark:from-green-900/50 dark:to-emerald-800/50 backdrop-blur-sm shadow-lg">
                  <span className="px-5 md:px-7 py-2 md:py-3 rounded-full bg-white/90 dark:bg-gray-900/90 text-sm md:text-base font-medium text-green-800 dark:text-green-200 flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Welcome to Digital Quran
                  </span>
                </div>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 bg-gradient-to-b from-green-800 via-green-700 to-green-600 dark:from-green-200 dark:via-green-300 dark:to-green-400 text-transparent bg-clip-text leading-tight">
                Experience the Holy Quran<br className="hidden sm:block" />in the Digital Age
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 md:mb-12 px-4 max-w-3xl mx-auto leading-relaxed">
                Immerse yourself in the divine words with beautiful recitations,<br className="hidden sm:block" />
                precise translations, and a modern reading experience
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
                <Link href="/quran" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-full group shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Reading
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-full border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced App Showcase Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-green-50/50 to-white/50 dark:from-green-950/30 dark:to-gray-950 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Enhanced Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8 md:space-y-10"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 dark:text-green-200 leading-tight">
                  Modern Quran Reading Experience
                </h2>
                <div className="space-y-6 md:space-y-8">
                  <motion.div 
                    className="flex items-start space-x-4 md:space-x-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl text-green-800 dark:text-green-200 mb-2">Clear Arabic Text</h3>
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">Experience the Quran with beautiful Uthmani script and precise verse markers</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-4 md:space-x-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900 dark:to-green-900 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Headphones className="w-6 h-6 md:w-7 md:h-7 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl text-green-800 dark:text-green-200 mb-2">Professional Recitations</h3>
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">Listen to beautiful recitations from renowned Qaris with verse-by-verse audio</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-4 md:space-x-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-green-50 dark:from-teal-900 dark:to-green-900 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Globe className="w-6 h-6 md:w-7 md:h-7 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl text-green-800 dark:text-green-200 mb-2">Multiple Translations</h3>
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">Read accurate translations in various languages to understand the meaning</p>
                    </div>
                  </motion.div>
                </div>

                <div className="pt-6 md:pt-8">
                  <Link href="/quran">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-full group shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Try it Now
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Enhanced App Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative mt-10 lg:mt-0"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-100/30 to-transparent dark:from-green-900/30" />
                  <div className="p-6 md:p-10">
                    <div className="space-y-6 md:space-y-8">
                      {/* Sample Verse Display */}
                      <div className="text-right font-arabic text-2xl sm:text-3xl lg:text-4xl leading-loose text-gray-800 dark:text-gray-100 mb-4 md:mb-6">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl">
                        In the name of Allah, the Entirely Merciful, the Especially Merciful
                      </div>
                      {/* Enhanced Audio Player Preview */}
                      <div className="flex items-center justify-center space-x-4 md:space-x-6 pt-6">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-green-700 dark:text-green-300" />
                        </motion.div>
                        <div className="flex-1 h-2 md:h-3 bg-green-100 dark:bg-green-900 rounded-full overflow-hidden">
                          <motion.div 
                            className="w-1/3 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            animate={{ x: ["-100%", "0%"] }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">1:1</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Enhanced Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-green-200/40 to-emerald-200/40 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-24 md:w-40 h-24 md:h-40 bg-gradient-to-br from-emerald-200/40 to-green-200/40 dark:from-emerald-900/40 dark:to-green-900/40 rounded-full blur-2xl animate-pulse" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Link href={feature.link} className="block h-full">
                    <Card className="relative p-8 h-full bg-gradient-to-br from-white via-white to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-green-900/30 hover:shadow-xl transition-all duration-300 rounded-[32px] border border-green-100/20 dark:border-green-800/20 backdrop-blur-sm group">
                      <div className="space-y-6">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-200 to-emerald-100 dark:from-green-800 dark:to-emerald-900 shadow-inner group-hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                          <div className="text-green-700 dark:text-green-300 transform group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-green-200 dark:to-green-400 text-transparent bg-clip-text group-hover:scale-[1.02] transition-transform duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <ChevronRight className="w-5 h-5 text-green-700 dark:text-green-300" />
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
