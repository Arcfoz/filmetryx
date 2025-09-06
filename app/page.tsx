import Footer from "@/components/layout/Footer";
import { ServerHero } from "@/components/layout/ServerHero";
import { MovieGridWithLoadMore } from "@/components/layout/MovieGridWithLoadMore";
import { fetchHomepageData } from "@/lib/tmdb";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default async function Home() {
  // Fetch all data in parallel on the server
  const { popularMovies, topRatedMovies, popularTv, topRatedTv } = await fetchHomepageData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191A39] from-30%">
      <main className="container mx-auto">
        <ServerHero />
        
        <MovieGridWithLoadMore initialMovies={popularMovies} media_type="movie" gridType="movie_popular" title="Movie Popular" isFirstSection={true} />
        
        <ScrollReveal direction="up" delay={0.1}>
          <MovieGridWithLoadMore initialMovies={topRatedMovies} media_type="movie" gridType="movie_top_rated" title="Movie Top Rated" />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <MovieGridWithLoadMore initialMovies={popularTv} media_type="tv" gridType="tv_popular" title="Tv Popular" />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <MovieGridWithLoadMore initialMovies={topRatedTv} media_type="tv" gridType="tv_top_rated" title="Tv Top Rated" />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3} className="flex flex-col items-center justify-center gap-4 text-center md:flex-row lg:text-center max-w-screen-2xl m-auto w-full px-3 sm:px-8 lg:px-16 xl:px-32">
          <AnimatedSection animation="slide-up" stagger staggerDelay={0.2} className="flex flex-row gap-4 items-center justify-center">
            <Link
              href="https://github.com/arcfoz/filmetryx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-zinc-400 hover:text-white inline-block transition-transform duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(130,196,255,0.8)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                <Github className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                <span>GitHub Repo</span>
              </div>
            </Link>

            <Link
              href="https://ikramth.is-a.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-zinc-400 hover:text-white inline-block transition-transform duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(130,196,255,0.8)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                <span>My Website</span>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
              </div>
            </Link>
          </AnimatedSection>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
