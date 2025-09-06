"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { fetchTvSeason } from "@/lib/tmdb";
import Footer from "@/components/layout/Footer";
import { Calendar, ImageOff } from "lucide-react";
import { CircularRating } from "@/components/CircularRating";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedSection, StaggeredGrid } from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useScrollAnimation";

interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

interface SeasonDetail {
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  tvName: string;
}

export default function SeasonPage({ params }: { params: { slug: string; seasonNumber: string } }) {
  const [seasonData, setSeasonData] = useState<SeasonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: parallaxRef, y: parallaxY } = useParallax(50);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const data = await fetchTvSeason(params.slug, params.seasonNumber);
        setSeasonData(data);
      } catch (error) {
        console.error("Error fetching season data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasonData();
  }, [params.slug, params.seasonNumber]);

  if (isLoading || !seasonData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="mx-auto min-h-screen relative">
      {/* Enhanced background with gradient overlay */}
      <div className="fixed inset-0 -z-10" ref={parallaxRef}>
        <motion.div style={{ y: parallaxY }}>
          {seasonData.poster_path ? (
            <>
              <Image src={`https://image.tmdb.org/t/p/original${seasonData.poster_path}`} alt="" fill className="object-cover brightness-[0.3] blur-3xl" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
            </>
          ) : (
            <div className="h-screen w-screen bg-gradient-to-b from-zinc-900 to-black" />
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-12">
          <ScrollReveal direction="fade" delay={0.2}>
            <nav className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-lg text-white/70 hover:text-white transition-colors" href={`/tv/${params.slug}`}>
                      {seasonData.tvName}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/50" />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-lg text-white/90" href={`/tv/${params.slug}/season/${params.seasonNumber}`}>
                      {seasonData.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </nav>
          </ScrollReveal>

          {/* Season Info */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <ScrollReveal direction="left" delay={0.4} className="md:col-span-3">
              <ScrollReveal direction="scale" delay={0.6}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
                  {seasonData.poster_path ? (
                    <Image src={`https://image.tmdb.org/t/p/w500${seasonData.poster_path}`} alt={seasonData.name} fill className="object-cover" priority />
                  ) : (
                    <div className="w-full h-full bg-zinc-800/50 flex items-center justify-center">
                      <ImageOff className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.5} className="md:col-span-9">
              <ScrollReveal direction="fade" delay={0.7}>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{seasonData.name}</h1>
              </ScrollReveal>

              <div className="space-y-6">
                <AnimatedSection animation="slide-up" delay={0.9}>
                  <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
                    <Calendar className="w-5 h-5 mr-2 text-white/70" />
                    <time className="text-lg text-white/90">
                      {new Date(seasonData.air_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </AnimatedSection>

                <ScrollReveal direction="up" delay={1.1}>
                  <p className="text-lg md:text-xl leading-relaxed text-white/80">{seasonData.overview || "No overview available."}</p>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </div>
        </header>

        {/* Episodes Section */}
        <ScrollReveal direction="up" className="mb-16">
          <section>
            <h2 className="text-3xl font-bold mb-8 text-white">Episodes</h2>

            <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" delay={0.1}>
              {seasonData.episodes.map((episode) => (
                <Link href={`/tv/${params.slug}/season/${params.seasonNumber}/episode/${episode.episode_number}`} key={episode.id} className="group block">
                  <Card className="h-full overflow-hidden transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm border-0 ring-1 ring-white/10 hover:ring-white/20">
                    <CardContent className="p-0">
                      <div className="relative group aspect-video overflow-hidden">
                        <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                          {episode.still_path ? (
                            <Image src={`https://image.tmdb.org/t/p/w500${episode.still_path}`} alt={episode.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-zinc-800/50 flex items-center justify-center">
                              <ImageOff className="w-8 h-8 text-zinc-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-white/70 mb-1">Episode {episode.episode_number}</p>
                              <h3 className="text-xl font-semibold text-white line-clamp-1">{episode.name}</h3>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md">
                              <CircularRating rating={episode.vote_average || 0} size={48} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3 text-sm text-white/60">
                          <Calendar className="w-4 h-4" />
                          <time>
                            {new Date(episode.air_date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                        <p className="text-base text-white/80 line-clamp-3">{episode.overview || "No overview available."}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </StaggeredGrid>
          </section>
        </ScrollReveal>
      </div>
      <Footer />
    </div>
  );
}
