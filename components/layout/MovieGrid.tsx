"use client";
import React, { useState, useEffect } from "react";
import { MovieGridContainer } from "./MovieGridContainer";
import { Movies } from "@/types/movie";

interface MovieGridProps {
  fetchMovies: (page: number) => Promise<Movies[]>;
  title: string;
  media_type: string;
  limit?: number;
  maxItems?: number;
}

export function MovieGrid({ fetchMovies, title, media_type, limit = 6, maxItems = 30 }: MovieGridProps) {
  const [allMovies, setAllMovies] = useState<Movies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedMovies, setDisplayedMovies] = useState<Movies[]>([]);
  const [totalLoaded, setTotalLoaded] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const page1 = await fetchMovies(1);
        setAllMovies(page1);
        const initialDisplay = page1.slice(0, Math.min(limit, maxItems));
        setDisplayedMovies(initialDisplay);
        setTotalLoaded(initialDisplay.length);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies");
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [fetchMovies, limit, maxItems]);

  const handleLoadMore = () => {
    const currentTotal = totalLoaded;
    const remainingToMax = maxItems - currentTotal;
    if (remainingToMax <= 0) return;

    const itemsToAdd = Math.min(limit, remainingToMax);
    const newMovies = allMovies.slice(currentTotal, currentTotal + itemsToAdd);
    setDisplayedMovies((prev) => [...prev, ...newMovies]);
    setTotalLoaded((prev) => prev + itemsToAdd);
  };

  return <MovieGridContainer title={title} isLoading={isLoading} error={error} media_type={media_type} displayedMovies={displayedMovies} totalLoaded={totalLoaded} maxItems={maxItems} handleLoadMore={handleLoadMore} />;
}
