"use client";

import React, { useState, useTransition } from "react";
import { Movies } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { MovieGridType } from "@/lib/tmdb";

interface EnhancedLoadMoreButtonProps {
  media_type: string;
  initialMovies: Movies[];
  gridType?: MovieGridType;
  maxPages?: number;
}

export function EnhancedLoadMoreButton({ 
  media_type,
  initialMovies
}: EnhancedLoadMoreButtonProps) {
  const [allMovies] = useState<Movies[]>(initialMovies);
  const [isLoading] = useState(false);
  const [isPending] = useTransition();


  // Performance: Show fewer skeleton items on mobile
  const getSkeletonCount = () => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth < 640 ? 3 : 6;
  };

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