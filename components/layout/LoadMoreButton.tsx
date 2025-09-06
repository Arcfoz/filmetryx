"use client";

import React, { useState } from "react";
import { Movies } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface LoadMoreButtonProps {
  allMovies: Movies[];
  initialDisplayed: Movies[];
  media_type: string;
  limit: number;
  maxItems: number;
}

export function LoadMoreButton({ 
  allMovies, 
  initialDisplayed, 
  media_type, 
  limit, 
  maxItems 
}: LoadMoreButtonProps) {
  const [displayedMovies, setDisplayedMovies] = useState<Movies[]>(initialDisplayed);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const currentTotal = displayedMovies.length;
      const remainingToMax = maxItems - currentTotal;
      const itemsToAdd = Math.min(limit, remainingToMax);
      const newMovies = allMovies.slice(currentTotal, currentTotal + itemsToAdd);
      
      setDisplayedMovies(prev => [...prev, ...newMovies]);
      setIsLoading(false);
    }, 300); // Small delay for better UX
  };

  const hasMore = displayedMovies.length < maxItems && displayedMovies.length < allMovies.length;

  return (
    <>
      {displayedMovies.length > initialDisplayed.length && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 mb-8">
          {displayedMovies.slice(initialDisplayed.length).map((movie) => (
            <MovieCard key={movie.id} movie={movie} media_type={media_type} showText={true}/>
          ))}
        </div>
      )}
      
      {hasMore && (
        <button 
          onClick={handleLoadMore} 
          disabled={isLoading} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
}