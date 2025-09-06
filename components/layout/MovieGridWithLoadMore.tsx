"use client";

import React, { useState, useTransition, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Movies } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { fetchMoviesByType, MovieGridType } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useInView } from "framer-motion";

interface MovieGridWithLoadMoreProps {
  title: string;
  initialMovies: Movies[];
  media_type: string;
  gridType: MovieGridType;
  maxPages?: number;
}

// Animation variants
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const movieCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const skeletonVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

const buttonVariants: Variants = {
  idle: {
    scale: 1
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  },
  loading: {
    scale: 1,
    transition: {
      duration: 0.2
    }
  }
};

const errorVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

// Utility to check for reduced motion preference
const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Custom shimmer skeleton component
const SkeletonCard = ({ index, reduceMotion }: { index: number; reduceMotion: boolean }) => {
  return (
    <motion.div
      key={`skeleton-${index}`}
      variants={reduceMotion ? {} : skeletonVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? {} : "show"}
      exit={reduceMotion ? {} : "exit"}
      className="group relative rounded-xl bg-background-main p-2"
    >
      <div className="relative w-full pb-[150%] overflow-hidden rounded-xl bg-gray-800">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
          animate={reduceMotion ? {} : {
            x: ["-100%", "100%"]
          }}
          transition={reduceMotion ? {} : {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="absolute bottom-2 right-2 z-10">
          <div className="w-9 h-9 rounded-full bg-gray-700" />
        </div>
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </motion.div>
  );
};

export function MovieGridWithLoadMore({ 
  title,
  initialMovies,
  media_type,
  gridType,
  maxPages = 5
}: MovieGridWithLoadMoreProps) {
  const [allMovies, setAllMovies] = useState<Movies[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [newlyLoadedIds, setNewlyLoadedIds] = useState<Set<number>>(new Set());
  const requestInProgress = useRef(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px 0px" });

  // Debounced load more function to prevent rapid clicks
  const handleLoadMore = useCallback(async () => {
    if (isLoading || currentPage >= maxPages || requestInProgress.current) return;
    
    requestInProgress.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const nextPage = currentPage + 1;
      const newMovies = await fetchMoviesByType(gridType, nextPage);
      
      // Use React 18 transition for better UX
      startTransition(() => {
        setAllMovies(prev => {
          // Prevent duplicate movies (defensive programming)
          const existingIds = new Set(prev.map(movie => movie.id));
          const filteredNewMovies = newMovies.filter(movie => !existingIds.has(movie.id));
          
          // Track newly loaded movie IDs for animation
          const newIds = new Set(filteredNewMovies.map(movie => movie.id));
          setNewlyLoadedIds(newIds);
          
          // Clear newly loaded IDs after animation completes
          setTimeout(() => {
            setNewlyLoadedIds(new Set());
          }, 1000);
          
          return [...prev, ...filteredNewMovies];
        });
        setCurrentPage(nextPage);
        setIsLoading(false);
        requestInProgress.current = false;
      });
    } catch (err) {
      console.error('Failed to load more movies:', err);
      setError('Failed to load more movies. Please try again.');
      setIsLoading(false);
      requestInProgress.current = false;
    }
  }, [gridType, currentPage, maxPages, isLoading]);

  const handleRetry = () => {
    setError(null);
    handleLoadMore();
  };

  // Performance: Show fewer skeleton items on mobile
  const getSkeletonCount = () => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth < 640 ? 3 : 6;
  };

  const hasMore = currentPage < maxPages;
  const loadingState = isLoading || isPending;
  const reduceMotion = shouldReduceMotion();

  // Simplified variants for reduced motion
  const accessibleVariants = {
    movieCard: reduceMotion ? {} : movieCardVariants,
    skeleton: reduceMotion ? {} : skeletonVariants,
    container: reduceMotion ? {} : containerVariants,
    button: reduceMotion ? {} : buttonVariants,
    error: reduceMotion ? {} : errorVariants
  };

  return (
    <motion.section 
      className="mb-8"
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? {} : "show"}
      variants={accessibleVariants.container}
    >
      <div className="sticky top-20 z-10 mb-8" ref={titleRef}>
        <div className="w-fit py-2 px-4 backdrop-blur-md bg-[#191A39]/95 rounded-full border border-white/10 shadow-lg transition-all duration-300">
          <motion.h3 
            className="text-xl font-semibold relative text-white"
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            animate={reduceMotion ? {} : (isTitleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 })}
            transition={reduceMotion ? {} : { duration: 0.6, ease: "easeOut" }}
          >
            {title}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-[#82C4FF]"
              initial={{ width: 0 }}
              animate={reduceMotion ? {} : (isTitleInView ? { width: "100%" } : { width: 0 })}
              transition={reduceMotion ? {} : { duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </motion.h3>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 mb-8"
        variants={accessibleVariants.container}
      >
        {/* All movies including loaded ones */}
        {allMovies.map((movie) => (
          <motion.div
            key={movie.id}
            variants={newlyLoadedIds.has(movie.id) && !reduceMotion ? accessibleVariants.movieCard : {}}
            initial={newlyLoadedIds.has(movie.id) && !reduceMotion ? "hidden" : false}
            animate={newlyLoadedIds.has(movie.id) && !reduceMotion ? "show" : {}}
            layout={!reduceMotion}
          >
            <MovieCard movie={movie} media_type={media_type} showText={true}/>
          </motion.div>
        ))}
        
        {/* Loading skeleton for next batch */}
        <AnimatePresence>
          {loadingState && Array.from({ length: getSkeletonCount() }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} index={index} reduceMotion={reduceMotion} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="text-center mb-4"
            variants={accessibleVariants.error}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? {} : "show"}
            exit={reduceMotion ? {} : "exit"}
          >
            <motion.p 
              className="text-red-400 mb-2"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? {} : { opacity: 1 }}
              transition={reduceMotion ? {} : { delay: 0.1 }}
            >
              {error}
            </motion.p>
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.95 }}
            >
              <Button
                onClick={handleRetry}
                variant="destructive"
              >
                Try Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load more button */}
      <AnimatePresence>
        {hasMore && !error && (
          <motion.div 
            className="flex justify-center items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={reduceMotion ? {} : { opacity: 0, y: 20 }}
            transition={reduceMotion ? {} : { duration: 0.3 }}
          >
            <motion.div
              variants={accessibleVariants.button}
              initial={reduceMotion ? false : "idle"}
              whileHover={reduceMotion ? {} : "hover"}
              whileTap={reduceMotion ? {} : "tap"}
              animate={reduceMotion ? {} : (loadingState ? "loading" : "idle")}
            >
              <Button 
                onClick={handleLoadMore} 
                disabled={loadingState}
                variant="outline"
                className="min-w-[140px] flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {loadingState ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center w-full"
                    >
                      <motion.div
                        animate={reduceMotion ? {} : { rotate: 360 }}
                        transition={reduceMotion ? {} : { duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2 flex-shrink-0"
                      >
                        <Loader2 className="h-4 w-4" />
                      </motion.div>
                      <span className="flex-shrink-0">Loading...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="load-more"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center w-full"
                    >
                      <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="flex-shrink-0">Load More</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}