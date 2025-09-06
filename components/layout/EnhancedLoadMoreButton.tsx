"use client";

import React, { useState, useTransition, useCallback, useRef } from "react";
import { Movies } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { fetchMoviesByType, MovieGridType } from "@/lib/tmdb";

interface EnhancedLoadMoreButtonProps {
  gridType: MovieGridType;
  media_type: string;
  initialMovies: Movies[];
  maxPages?: number;
}

export function EnhancedLoadMoreButton({ 
  gridType,
  media_type,
  initialMovies,
  maxPages = 5 // Limit to 5 pages (100 items) for performance
}: EnhancedLoadMoreButtonProps) {
  const [allMovies, setAllMovies] = useState<Movies[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const requestInProgress = useRef(false);

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

  // Performance: Show fewer skeleton items on mobile
  const getSkeletonCount = () => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth < 640 ? 3 : 6;
  };

  const handleRetry = () => {
    setError(null);
    handleLoadMore();
  };

  const hasMore = currentPage < maxPages;
  const loadingState = isLoading || isPending;

  return (
    <>
      {/* Additional movies beyond the initial set - render as individual cards to append to existing grid */}
      {allMovies.slice(initialMovies.length).map((movie) => (
        <MovieCard key={movie.id} movie={movie} media_type={media_type} showText={true}/>
      ))}

      {/* Loading skeleton for next batch - render as individual skeleton cards */}
      {loadingState && Array.from({ length: getSkeletonCount() }).map((_, index) => (
        <div key={`skeleton-${index}`} className="group relative rounded-xl bg-background-main p-2">
          <div className="relative w-full pb-[150%] overflow-hidden rounded-xl bg-gray-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
            <div className="absolute bottom-2 right-2 z-10">
              <div className="w-9 h-9 rounded-full bg-gray-700 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}