'use client';

import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Globe, ChevronRight, ChevronUp } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50/30 dark:from-green-950 dark:via-gray-950 dark:to-green-950/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-green-200/20 to-emerald-200/20 dark:from-green-900/10 dark:to-emerald-900/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-200/20 to-green-200/20 dark:from-emerald-900/10 dark:to-green-900/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 animate-pulse-slow" />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-green-200/30 to-transparent" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-emerald-200/30 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4ade8030_1px,transparent_1px),linear-gradient(to_bottom,#4ade8030_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>
          </div>

          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto relative"
            >
              {/* Updated welcome badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-12"
              >
                <div className="inline-block p-2 rounded-full bg-gradient-to-r from-green-200/50 to-emerald-100/50 dark:from-green-900/50 dark:to-emerald-800/50 backdrop-blur-sm shadow-lg">
                  <div className="px-8 py-3 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center gap-4">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xl font-semibold text-green-800 dark:text-green-200">
                      Welcome to Quran Sphere
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced heading with animated gradient */}
              <h1 className="text-6xl md:text-8xl font-bold mb-10 relative tracking-tight">
                <span className="bg-gradient-to-r from-green-800 via-green-600 to-emerald-600 dark:from-green-200 dark:via-green-300 dark:to-emerald-300 bg-clip-text text-transparent animate-gradient">
                  Experience the Holy Quran
                </span>
              </h1>

              {/* Updated description */}
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-16 leading-relaxed max-w-2xl mx-auto">
                Immerse yourself in the divine words with beautiful recitations
                and modern reading experience
              </p>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 mb-16">
                <Link href="/quran">
                  <Button 
                    size="lg" 
                    className="px-16 py-10 text-2xl rounded-[50px] font-medium
                      bg-green-600 hover:bg-green-700 transition-all duration-300
                      shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-3">
                      Start Reading
                      <ChevronRight className="w-6 h-6" />
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Updated scroll text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-base font-medium text-gray-500 dark:text-gray-400 text-center mt-4"
              >
                Scroll to explore
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* App Showcase Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-12 md:space-y-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-200 leading-tight">
                  Quran Sphere Reading Experience
                </h2>

                <div className="space-y-8">
                  {/* Clear Arabic Text Feature */}
                  <motion.div 
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <BookOpen className="w-7 h-7 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                        Clear Arabic Text
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Experience the Quran with beautiful Uthmani script and precise verse markers
                      </p>
                    </div>
                  </motion.div>

                  {/* Professional Recitations Feature */}
                  <motion.div 
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900 dark:to-green-900 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Headphones className="w-7 h-7 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                        Professional Recitations
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Listen to beautiful recitations from renowned Qaris with verse-by-verse audio
                      </p>
                    </div>
                  </motion.div>

                  {/* Multiple Translations Feature */}
                  <motion.div 
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-green-50 dark:from-teal-900 dark:to-green-900 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Globe className="w-7 h-7 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                        Multiple Translations
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Read accurate translations in various languages to understand the meaning
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="pt-8 md:pt-12">
                  <Link href="/quran">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-10 py-7 rounded-full group shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Try it Now
                      <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Right Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-100/30 to-transparent dark:from-green-900/30" />
                  <div className="p-8">
                    <div className="space-y-6">
                      {/* Arabic Text */}
                      <div className="text-right font-arabic text-3xl leading-loose text-gray-800 dark:text-gray-100">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      {/* Translation */}
                      <div className="text-gray-600 dark:text-gray-300">
                        In the name of Allah, the Entirely Merciful, the Especially Merciful
                      </div>
                      {/* Verse Progress */}
                      <div className="flex items-center gap-2 mt-4">
                        <div className="flex-1 h-2 bg-green-100 dark:bg-green-900/50 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-gradient-to-r from-green-500 to-emerald-500" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">1:1</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-200/40 to-emerald-200/40 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-gradient-to-br from-emerald-200/40 to-green-200/40 dark:from-emerald-900/40 dark:to-green-900/40 rounded-full blur-2xl animate-pulse" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={feature.link}>
                    <Card className="p-8 h-full backdrop-blur-md bg-white/70 dark:bg-gray-900/70 hover:shadow-xl transition-all duration-300 rounded-3xl border border-green-100/20 dark:border-green-800/20 group">
                      <div className="space-y-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
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

      {/* Floating Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-green-100/20 dark:border-green-800/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">QS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 dark:from-green-200 dark:to-emerald-300 bg-clip-text text-transparent">
                Quran Sphere
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/quran">
                <Button variant="ghost" className="text-green-800 dark:text-green-200">
                  Read Quran
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Add Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
            border border-green-100/20 dark:border-green-800/20 
            hover:bg-green-50 dark:hover:bg-green-900/50
            shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Add this to your CSS */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
