"use client";

import DevelopmentAlert from "@/components/DevelopmentAlert";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { MovieGrid } from "@/components/layout/MovieGrid";
import { fetchPopular, fetchTvTopRated } from "@/lib/tmdb";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const handleLoaded = () => setIsLoading(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191A39] from-30%">
      <DevelopmentAlert />
      <main className="container mx-auto">
        <Hero />
        <MovieGrid fetchMovies={fetchPopular} media_type="movie" title="Movie Popular" limit={20} maxItems={20} onLoaded={handleLoaded} />
        <MovieGrid fetchMovies={fetchTvTopRated} media_type="tv" title="Tv Top Rated" limit={20} maxItems={20} />

        {!isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row lg:text-center max-w-screen-2xl m-auto w-full px-3 sm:px-8 lg:px-16 xl:px-32">
            <Link
              href="https://github.com/arcfoz/filmetryx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-zinc-400 hover:text-white inline-block"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(130,196,255,0.8)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                <Github className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                <span>GitHub Repo</span>
              </div>
            </Link>

            <Link
              href="https://ikramth.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-zinc-400 hover:text-white inline-block"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(130,196,255,0.8)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                <span>My Website</span>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-white" />
              </div>
            </Link>
          </div>
        )}
      </main>
      {!isLoading && <Footer />}
    </div>
  );
}
