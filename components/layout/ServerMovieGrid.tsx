import React from "react";
import { Movies } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { EnhancedLoadMoreButton } from "./EnhancedLoadMoreButton";
import { MovieGridType } from "@/lib/tmdb";

interface ServerMovieGridProps {
  title: string;
  movies: Movies[];
  media_type: string;
  gridType: MovieGridType;
  limit?: number;
}

export function ServerMovieGrid({ 
  title, 
  movies, 
  media_type, 
  gridType,
  limit = 20
}: ServerMovieGridProps) {
  const displayedMovies = movies.slice(0, limit);

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold mb-4 sm:mb-0">{title}</h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 mb-8">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} media_type={media_type} showText={true}/>
        ))}
        
        {/* Load more items and skeletons are rendered inside the same grid */}
        <EnhancedLoadMoreButton 
          gridType={gridType}
          media_type={media_type}
          initialMovies={displayedMovies}
          maxPages={5}
        />
      </div>
      
    </section>
  );
}