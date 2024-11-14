import React from "react";
import { Movies } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface MovieGridContainerProps {
  title: string;
  isLoading: boolean;
  media_type: string;
  error: string | null;
  displayedMovies: Movies[];
  totalLoaded: number;
  maxItems: number;
  handleLoadMore: () => void;
}

export function MovieGridContainer({ title, isLoading, error, displayedMovies, media_type, maxItems, handleLoadMore }: MovieGridContainerProps) {
  if (isLoading && displayedMovies.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold mb-4 sm:mb-0">{title}</h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 mb-8">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} media_type={media_type} showText={true}/>
        ))}
      </div>
      {!isLoading && displayedMovies.length < maxItems && (
        <button onClick={handleLoadMore} disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </section>
  );
}
