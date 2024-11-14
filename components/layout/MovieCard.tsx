import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Movies } from "@/types/movie";
import { CircularRating } from "../CircularRating";

interface MovieCardProps {
  movie: Movies;
  media_type?: string;
  children?: React.ReactNode;
  showText?: boolean;
}

export function MovieCard({ movie, media_type, children, showText }: MovieCardProps) {
  const [gradientPosition, setGradientPosition] = useState({ x: -200, y: -200 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setGradientPosition({ x: e.clientX - left, y: e.clientY - top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGradientPosition({ x: -600, y: -600 });
  }, []);

  return (
    <div>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-xl bg-background-main p-2 transition-all duration-300"
      >
        {/* Border effect overlay */}
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, rgba(59, 130, 246, 0.2), transparent 80%)`,
            maskImage: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, black 50%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, black 50%, transparent 80%)`,
            border: "2px solid rgba(59, 130, 246, 0.3)"
          }}
        />

        {/* Main card content */}
        <div className="relative transform transition-transform duration-300 group-hover:scale-95">
          <Link href={`/${media_type ?? "movie"}/${movie.id}`} className="block focus:outline-none">
            <div
              className="relative w-full pb-[150%] overflow-hidden rounded-xl bg-mediaCard-hoverBackground bg-cover bg-center transition-[border-radius] duration-300 group-hover:rounded-lg"
              style={{
                backgroundImage: movie.poster_path ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` : undefined,
              }}
            >
              <div className="absolute bottom-2 right-2 z-10">
                <CircularRating rating={movie.vote_average || 0} />
              </div>
            </div>
            {showText && (
              <>
                <h1 className="mt-2 line-clamp-2 text-ellipsis break-words font-bold text-white">
                  <span>{movie.title || movie.name}</span>
                </h1>
                <div className="mt-1 text-xs text-gray-400">
                  {media_type || "movie"} •{" "}
                  {movie.release_date &&
                    new Date(movie.release_date ?? movie.first_air_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </div>
              </>
            )}
          </Link>
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
