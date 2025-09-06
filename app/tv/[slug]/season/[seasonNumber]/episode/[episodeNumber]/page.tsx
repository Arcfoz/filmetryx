"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchTvEpisode, fetchTvTrailerEpisode } from "@/lib/tmdb";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Movies, VideoTvEpisode } from "@/types/movie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, ImageOff , User2 } from "lucide-react";
import { CircularRating } from "@/components/CircularRating";
import { SelectedVideo } from "@/app/movie/[slug]/page";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedSection, StaggeredGrid, FadeInSection } from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useScrollAnimation";

interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  character: string;
  credit_id: string;
  order: number;
}

interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

interface EpisodeDetail {
  air_date: string;
  crew: Crew[];
  episode_number: number;
  guest_stars: Cast[];
  name: string;
  overview: string;
  id: number;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  recommendations?: {
    results: Movies[];
  };
  tvName: string;
  seasonName: string;
}

interface ImageData {
  stills: Array<{
    aspect_ratio: number;
    height: number;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
}

export default function EpisodePage({ params }: { params: { slug: string; seasonNumber: string; episodeNumber: string } }) {
  const [episodeData, setEpisodeData] = useState<EpisodeDetail | null>(null);
  const [images, setImages] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoTvEpisode | null>(null);
  const [visibleImages, setVisibleImages] = useState(12);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const { ref: parallaxRef, y: parallaxY } = useParallax(80);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tvData = await fetchTvEpisode(params.slug, params.seasonNumber, params.episodeNumber);

        setEpisodeData(tvData);
        setImages(tvData.images);

        const videos = await fetchTvTrailerEpisode(params.slug, params.seasonNumber, params.episodeNumber);
        setVideos(videos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug, params.seasonNumber, params.episodeNumber]);

  const loadMoreImages = () => {
    setVisibleImages((prev) => prev + ITEMS_PER_PAGE);
  };

  if (isLoading || !episodeData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const openDialog = (videoId: string, title: string) => {
    setSelectedVideo({ videoId, title });
  };

  const closeDialog = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="mx-auto min-h-screen relative">
      {/* Enhanced background with gradient overlay */}
      <div className="fixed inset-0 -z-10" ref={parallaxRef}>
        <motion.div style={{ y: parallaxY }}>
          {episodeData.still_path ? (
            <>
              <Image src={`https://image.tmdb.org/t/p/original${episodeData.still_path}`} alt="" fill className="object-cover brightness-[0.3] blur-3xl" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
            </>
          ) : (
            <div className="h-screen w-screen bg-gradient-to-b from-zinc-900 to-black" />
          )}
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <ScrollReveal direction="fade" delay={0.2}>
          <nav className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-lg text-white/70 hover:text-white transition-colors" href={`/tv/${params.slug}`}>
                    {episodeData.tvName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-lg text-white/70 hover:text-white transition-colors" href={`/tv/${params.slug}/season/${params.seasonNumber}`}>
                    {episodeData.seasonName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg text-white/90">{episodeData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>
        </ScrollReveal>

        {/* Hero Section */}
        <ScrollReveal direction="scale" delay={0.4}>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-2xl ring-1 ring-white/10">
            {episodeData.still_path ? (
              <Image src={`https://image.tmdb.org/t/p/original${episodeData.still_path}`} alt={episodeData.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-zinc-800/50 flex items-center justify-center">
                <ImageOff className="w-16 h-16 text-zinc-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>
        </ScrollReveal>

        {/* Episode Details */}
        <div className="mb-16">
          <ScrollReveal direction="fade" delay={0.6}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {episodeData.episode_number}. {episodeData.name}
            </h1>
          </ScrollReveal>

          <AnimatedSection animation="slide-up" stagger staggerDelay={0.2} delay={0.8}>
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <Calendar className="w-5 h-5 mr-2 text-white/70" />
                <time className="text-lg text-white/90">
                  {new Date(episodeData.air_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>

              {episodeData.runtime && (
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
                  <Clock className="w-5 h-5 mr-2 text-white/70" />
                  <span className="text-lg text-white/90">{episodeData.runtime} minutes</span>
                </div>
              )}

              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <CircularRating rating={episodeData.vote_average || 0} size={40} />
              </div>
            </div>
          </AnimatedSection>

          <ScrollReveal direction="up" delay={1.0}>
            <p className="text-xl leading-relaxed text-white/80">{episodeData.overview}</p>
          </ScrollReveal>
        </div>

        {/* Images Section */}
        {images && images.stills.length > 0 && (
          <ScrollReveal direction="up" className="mb-16">
            <section>
              <h2 className="text-3xl font-bold mb-8 text-white">Images</h2>
              <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" delay={0.1}>
                {images.stills.slice(0, visibleImages).map((image, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden group cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border-0 ring-1 ring-white/10 hover:ring-white/20"
                    onClick={() => setSelectedImage(image.file_path)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <Image src={`https://image.tmdb.org/t/p/w780${image.file_path}`} alt={`Still ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </StaggeredGrid>

              {visibleImages < images.stills.length && (
                <div className="mt-8 text-center">
                  <Button onClick={loadMoreImages} variant="outline" className="min-w-[200px] bg-white/5 hover:bg-white/10 text-white border-white/20">
                    Load More Images
                    <span className="ml-2 text-white/60">
                      ({visibleImages}/{images.stills.length})
                    </span>
                  </Button>
                </div>
              )}
            </section>
          </ScrollReveal>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <div className="absolute max-w-7xl w-full h-full">
              <Image src={`https://image.tmdb.org/t/p/original${selectedImage}`} alt="Preview" fill className="object-contain" />
            </div>
            <button className="absolute top-4 right-4 text-white text-xl p-2 hover:bg-white/10 rounded-full" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
          </div>
        )}

        {videos && (
          <ScrollReveal direction="up" className="mt-12 pb-12">
            <Tabs defaultValue="clips" className="w-full">
              <FadeInSection delay={0.2}>
                <div className="flex justify-center">
                  <TabsList className="mb-6 bg-[#101327] p-3">
                  {videos.trailers && (
                    <TabsTrigger value="trailers" className="data-[state=active]:bg-[#191A39]">
                      Trailer ({videos.trailers.length})
                    </TabsTrigger>
                  )}
                  {videos.teasers && (
                    <TabsTrigger value="teasers" className="data-[state=active]:bg-[#191A39]">
                      Teasers ({videos.teasers?.length})
                    </TabsTrigger>
                  )}
                  {videos.clips && (
                    <TabsTrigger value="clips" className="data-[state=active]:bg-[#191A39]">
                      Clip ({videos.clips.length})
                    </TabsTrigger>
                  )}
                  {videos.btss && (
                    <TabsTrigger value="btss" className="data-[state=active]:bg-[#191A39]">
                      Behind The Scenes ({videos.btss?.length})
                    </TabsTrigger>
                  )}
                  {videos.featurettes && (
                    <TabsTrigger value="featurettes" className="data-[state=active]:bg-[#191A39] ">
                      Featurettes ({videos.featurettes?.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
              </FadeInSection>

              {/* Trailer Section */}
              {videos.trailers && (
                <TabsContent value="trailers">
                  <StaggeredGrid className="grid gap-6" delay={0.1}>
                    {videos.trailers.map((trailer) => (
                      <Card key={trailer.key} className="cursor-pointer flex flex-col md:flex-row items-center" onClick={() => openDialog(trailer.key, trailer.name)}>
                        <div className="md:w-1/3 rounded-lg  p-4 flex-shrink-0 w-full">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`} alt="Clip thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 md:pl-6 flex flex-col justify-center w-full">
                          <h2 className="text-lg font-semibold text-center md:text-left">{trailer.name}</h2>
                          <p className="text-sm text-gray-500 text-center md:text-left">Release Date: {new Date(trailer.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                </TabsContent>
              )}

              {/* teaser Section */}
              {videos.teasers && (
                <TabsContent value="teasers">
                  <StaggeredGrid className="grid gap-6" delay={0.1}>
                    {videos.teasers.map((teaser) => (
                      <Card key={teaser.key} className="cursor-pointer flex flex-col md:flex-row items-center" onClick={() => openDialog(teaser.key, teaser.name)}>
                        <div className="md:w-1/3 rounded-lg  p-4 flex-shrink-0 w-full">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${teaser.key}/hqdefault.jpg`} alt="Teaser thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 md:pl-6 flex flex-col justify-center w-full">
                          <h2 className="text-lg font-semibold text-center md:text-left">{teaser.name}</h2>
                          <p className="text-sm text-gray-500 text-center md:text-left">Release Date: {new Date(teaser.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                </TabsContent>
              )}

              {/* clip Section */}
              {videos.clips && (
                <TabsContent value="clips">
                  <StaggeredGrid className="grid gap-6" delay={0.1}>
                    {videos.clips.map((clip) => (
                      <Card key={clip.key} className="cursor-pointer flex flex-col md:flex-row items-center" onClick={() => openDialog(clip.key, clip.name)}>
                        <div className="md:w-1/3 rounded-lg  p-4 flex-shrink-0 w-full">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${clip.key}/hqdefault.jpg`} alt="Clip thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 md:pl-6 flex flex-col justify-center w-full">
                          <h2 className="text-lg font-semibold text-center md:text-left">{clip.name}</h2>
                          <p className="text-sm text-gray-500 text-center md:text-left">Release Date: {new Date(clip.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                </TabsContent>
              )}

              {/* BTS Section */}
              {videos.btss && (
                <TabsContent value="btss">
                  <StaggeredGrid className="grid gap-6" delay={0.1}>
                    {videos.btss.map((bts) => (
                      <Card key={bts.key} className="cursor-pointer flex flex-col md:flex-row items-center" onClick={() => openDialog(bts.key, bts.name)}>
                        <div className="md:w-1/3 rounded-lg  p-4 flex-shrink-0 w-full">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${bts.key}/hqdefault.jpg`} alt="BTS thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 md:pl-6 flex flex-col justify-center w-full">
                          <h2 className="text-lg font-semibold text-center md:text-left">{bts.name}</h2>
                          <p className="text-sm text-gray-500 text-center md:text-left">Release Date: {new Date(bts.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                </TabsContent>
              )}

              {/* Featurettes Section */}
              {videos.featurettes && (
                <TabsContent value="featurettes">
                  <StaggeredGrid className="grid gap-6" delay={0.1}>
                    {videos.featurettes.map((featurette) => (
                      <Card key={featurette.key} className="cursor-pointer flex flex-col md:flex-row items-center" onClick={() => openDialog(featurette.key, featurette.name)}>
                        <div className="md:w-1/3 rounded-lg  p-4 flex-shrink-0 w-full">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${featurette.key}/hqdefault.jpg`} alt="BTS thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 md:pl-6 flex flex-col justify-center w-full">
                          <h2 className="text-lg font-semibold text-center md:text-left">{featurette.name}</h2>
                          <p className="text-sm text-gray-500 text-center md:text-left">Release Date: {new Date(featurette.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                </TabsContent>
              )}
            </Tabs>
          </ScrollReveal>
        )}

        {/* Cast & Crew Grid */}
        <ScrollReveal direction="up" className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Guest Stars */}
          {episodeData.guest_stars?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 text-white">Guest Stars</h2>
              <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4" delay={0.1}>
                {episodeData.guest_stars.map((actor) => (
                  <Card key={actor.credit_id} className="flex items-center p-4 space-x-4 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border-0 ring-1 ring-white/10">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-white/20">
                      {actor.profile_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <User2 className="w-8 h-8 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{actor.name}</h3>
                      <p className="text-sm text-white/70">{actor.character}</p>
                    </div>
                  </Card>
                ))}
              </StaggeredGrid>
            </section>
          )}

          {/* Crew */}
          {episodeData.crew?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 text-white">Crew</h2>
              <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4" delay={0.1}>
                {episodeData.crew.map((member) => (
                  <Card key={member.credit_id} className="flex items-center p-4 space-x-4 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border-0 ring-1 ring-white/10">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-white/20">
                      {member.profile_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} alt={member.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <User2 className="w-8 h-8 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-white/70">{member.job}</p>
                    </div>
                  </Card>
                ))}
              </StaggeredGrid>
            </section>
          )}
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" className="container mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommendation</h2>
        <StaggeredGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-8 mb-8" delay={0.1}>
          {episodeData.recommendations?.results?.map((recommendation) => (
            <RecommendationCard key={recommendation.id} movie={recommendation} media_type={"tv"} showText={false} />
          ))}
        </StaggeredGrid>
      </ScrollReveal>

      {selectedVideo && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogOverlay />
          <DialogContent className="p-4 rounded-lg shadow-lg z-50 m-auto max-w-7xl">
            <DialogTitle className="text-xl font-bold mb-4">{selectedVideo.title}</DialogTitle>
            <YouTubeEmbed videoid={selectedVideo.videoId} style="width: 100%; max-width: 2048px;" />
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
