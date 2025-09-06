"use client";
import { DetailMovie } from "@/types/movie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { addToFavorites, checkIfFavorite, fetchFilm } from "@/lib/tmdb";
import { toast } from "sonner";
import { YouTubeEmbed } from "@next/third-parties/google";
import { CollectionLink } from "@/components/collin";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/Footer";
import { CircularRating } from "@/components/CircularRating";
import { GlobeIcon, HeartIcon, HeartOffIcon, User } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedSection, StaggeredGrid, FadeInSection } from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useScrollAnimation";
import { MovieDetailSkeleton } from "@/components/ui/MovieDetailSkeleton";

export interface SelectedVideo {
  videoId: string;
  title: string;
}

const ITEMS_PER_PAGE = 10;

export default function MoviePage({ params }: { params: { slug: string } }) {
  const [movie, setMovie] = useState<DetailMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleBackdrops, setVisibleBackdrops] = useState(ITEMS_PER_PAGE);
  const [visiblePosters, setVisiblePosters] = useState(ITEMS_PER_PAGE);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const { data: session } = useSession();
  const { ref: parallaxRef, y: parallaxY } = useParallax(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchFilm(params.slug, "movie");
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (movie && session) {
        try {
          if (session?.user?.session_id) {
            const isMovieFavorite = await checkIfFavorite(movie.id, session.user.session_id, "movies");
            setIsFavorite(isMovieFavorite);
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [movie, session]);

  const loadMoreBackdrops = () => {
    setVisibleBackdrops((prev) => prev + ITEMS_PER_PAGE);
  };

  const loadMorePosters = () => {
    setVisiblePosters((prev) => prev + ITEMS_PER_PAGE);
  };

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return <div className="flex items-center justify-center min-h-screen">!!!</div>;
  }

  const releaseDate = new Date(movie.release_date);
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const releaseYear = releaseDate.getFullYear();

  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  const getCrewByJob = (job: string) => {
    if (movie.credits && movie.credits.crew) {
      return movie.credits.crew.filter((member) => member.job === job);
    }
    return [];
  };

  const directors = getCrewByJob("Director");
  const writers = movie && movie.credits && movie.credits.crew ? movie.credits.crew.filter((member) => ["Screenplay", "Writer", "Story"].includes(member.job)) : [];
  const producers = getCrewByJob("Producer");

  const handleFavoriteClick = async (moviesId: number, isFavorite: boolean) => {
    if (!session) {
      toast.info("Please login to add favorite", {
        position: "bottom-center",
      });
      return;
    }

    try {
      if (session?.user?.session_id) {
        const response = await addToFavorites(moviesId, session.user.session_id, isFavorite, "movie");
        if (response.success) {
          setIsFavorite(!isFavorite);
          toast.success(isFavorite ? "Removed from favorites!" : "Added to favorites!", {
            position: "bottom-center",
          });
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites", {
        position: "bottom-center",
      });
    }
  };

  const openDialog = (videoId: string, title: string) => {
    setSelectedVideo({ videoId, title });
  };

  const closeDialog = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="container relative">
      {/* Full page background with blur */}
      <div className="fixed inset-0 -z-10">
        {movie.backdrop_path ? <Image src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt="" fill className="object-cover brightness-[0.3] blur-3xl" priority /> : <div className="h-screen w-screen bg-black" />}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      {/* Hero Section with Backdrop */}
      <div className="mx-auto px-4 py-8">
        <div className="relative w-full h-[500px] rounded-t-xl overflow-hidden" ref={parallaxRef}>
          <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
            {movie.backdrop_path ? <Image src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt="" fill className="object-cover" priority /> : <div className="h-full w-full bg-black" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent " />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 -mt-72 relative">
        <div className="grid md:grid-cols-12 gap-8 max-w-[1400px] mx-auto ">
          {/* Poster & Action Buttons */}
          <ScrollReveal direction="left" delay={0.2} className="md:col-span-3">
            <div className="space-y-4 w-full max-w-[300px] mx-auto">
              <ScrollReveal direction="scale" delay={0.4}>
                <div className="aspect-[2/3] relative w-full">
                  <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title ?? ""} fill className="rounded-lg shadow-xl object-cover" priority />
                  <div className="absolute bottom-2 right-2 z-10">
                    <CircularRating rating={movie.vote_average || 0} size={48} />
                  </div>
                </div>
              </ScrollReveal>
              {/* Action Buttons */}
              <AnimatedSection animation="slide-up" stagger staggerDelay={0.1} delay={0.6}>
                <div className="flex flex-col w-full gap-3">
                  {movie.homepage && (
                    <Link href={movie.homepage} target="_blank" className="w-full">
                      <Button variant={"outline"} className="flex items-center justify-center w-full py-2">
                        <GlobeIcon className="w-5 h-5 mr-2" />
                        Website
                      </Button>
                    </Link>
                  )}
                  <Button variant={isFavorite ? "outline" : "default"} onClick={() => handleFavoriteClick(movie.id, isFavorite)} className="flex items-center justify-center w-full py-2">
                    {isFavorite ? <HeartOffIcon className="w-5 h-5 mr-2" /> : <HeartIcon className="w-5 h-5 mr-2" />}
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </ScrollReveal>

          {/* Details */}
          <ScrollReveal direction="right" delay={0.3} className="md:col-span-9 text-white">
            <div className="max-w-5xl ">
              <ScrollReveal direction="fade" delay={0.5}>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {movie.title} ({releaseYear})
                </h1>
              </ScrollReveal>

              {/* Meta Info */}
              <ScrollReveal direction="fade" delay={0.7}>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 text-sm">
                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-4 justify-center items-center">
                    {movie.genres && movie.genres.length > 0 && (
                      <>
                        {movie.genres.map((genre) => (
                          <span key={genre.id} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {genre.name}
                          </span>
                        ))}
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      </>
                    )}
                    <div>{formattedDate}</div>
                  </div>
                </div>
              </ScrollReveal>

              {movie.tagline && (
                <ScrollReveal direction="fade" delay={0.9}>
                  <p className="text-xl text-gray-200 italic mb-4">{movie.tagline}</p>
                </ScrollReveal>
              )}

              {/* Overview */}
              <ScrollReveal direction="up" delay={1.0}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Overview</h2>
                  <p className="text-gray-200 leading-relaxed">{movie.overview}</p>
                </div>
              </ScrollReveal>

              {/* Crew Information */}
              <ScrollReveal direction="up" delay={1.2}>
                <div className="space-y-4 mb-6">
                  {directors.length > 0 && (
                    <div>
                      <span className="font-bold">Director{directors.length > 1 ? "s" : ""}:</span>{" "}
                      {directors.map((director, index) => (
                        <span key={director.id}>
                          <Link href={`/person/${director.id}`} className="text-blue-300 hover:text-blue-400">
                            {director.name}
                          </Link>
                          {index < directors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  {writers.length > 0 && (
                    <div>
                      <span className="font-bold">Writer{writers.length > 1 ? "s" : ""}:</span>{" "}
                      {writers.map((writer, index) => (
                        <span key={writer.id}>
                          <Link href={`/person/${writer.id}`} className="text-blue-300 hover:text-blue-400">
                            {writer.name}
                          </Link>
                          {writer.job !== "Writer" && ` (${writer.job})`}
                          {index < writers.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  {producers.length > 0 && (
                    <div>
                      <span className="font-bold">Producer{producers.length > 1 ? "s" : ""}:</span>{" "}
                      {producers.map((producer, index) => (
                        <span key={producer.id}>
                          <Link href={`/person/${producer.id}`} className="text-blue-300 hover:text-blue-400">
                            {producer.name}
                          </Link>
                          {index < producers.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Technical */}
              <ScrollReveal direction="bounce" delay={1.4}>
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-6 sm:p-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Runtime</h3>
                        <p className="text-gray-200">
                          {hours}h {minutes}m ({movie.runtime} minutes)
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Audio</h3>
                        <p className="text-gray-200">{movie.spoken_languages.map((lang) => lang.english_name).join(", ")}</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Status</h3>
                        <p className="text-gray-200">{movie.status}</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Production Companies</h3>
                        <p className="text-gray-200">{movie.production_companies.map((company) => company.name).join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {movie.belongs_to_collection && (
                <ScrollReveal direction="up" delay={1.6}>
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Collection</h2>
                    <CollectionLink collection={movie.belongs_to_collection} />
                  </div>
                </ScrollReveal>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Cast Section */}
        <ScrollReveal direction="up" className="mx-auto mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Movie Cast</h2>
            <Link href={`/movie/${params.slug}/cast`} className="text-blue-600 hover:text-blue-800 font-medium">
              See Full Cast
            </Link>
          </div>
          <div className="backdrop-blur-md bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-6">
            <StaggeredGrid className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" delay={0.05}>
              {movie?.credits?.cast?.slice(0, 15).map((member) => (
                <div key={member.id} className="group relative overflow-hidden rounded-lg">
                  <Link href={`/person/${member.id}`} className="block">
                    <div className="relative aspect-[2/3]">
                      {member.profile_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <User className="text-zinc-500 w-32 h-32 transition-colors duration-300" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-2 bg-zinc-100/10 rounded-b-lg group-hover:bg-zinc-100/20 transition-colors duration-300">
                    <h3 className="font-semibold text-sm md:text-base mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{member.name}</h3>
                    {member.character && <p className="text-sm md:text-base text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">as {member.character}</p>}
                  </div>
                </div>
              ))}
            </StaggeredGrid>
          </div>
        </ScrollReveal>

        {/* Media Section */}
        {movie.images && (movie.images.backdrops || movie.images.posters) && (
          <ScrollReveal direction="up" className="mt-12 pb-12">
            <Tabs defaultValue="backdrops" className="w-full">
              <FadeInSection delay={0.2}>
                <div className="flex justify-center">
                  <TabsList className="mb-24 bg-transparent p-3 flex flex-wrap justify-center gap-2 sm:mb-16">
                  {movie.images.backdrops && (
                    <TabsTrigger value="backdrops" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Backdrops ({movie.images.backdrops.length})
                    </TabsTrigger>
                  )}
                  {movie.images.posters && (
                    <TabsTrigger value="posters" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Posters ({movie.images.posters.length})
                    </TabsTrigger>
                  )}
                  {movie.trailers && (
                    <TabsTrigger value="trailers" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Trailers ({movie.trailers?.length})
                    </TabsTrigger>
                  )}
                  {movie.teasers && (
                    <TabsTrigger value="teasers" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Teasers ({movie.teasers?.length})
                    </TabsTrigger>
                  )}
                  {movie.clips && (
                    <TabsTrigger value="clips" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Clips ({movie.clips?.length})
                    </TabsTrigger>
                  )}
                  {movie.btss && (
                    <TabsTrigger value="btss" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Behind The Scenes ({movie.btss?.length})
                    </TabsTrigger>
                  )}
                  {movie.featurettes && (
                    <TabsTrigger value="featurettes" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Featurettes ({movie.featurettes?.length})
                    </TabsTrigger>
                  )}
                  </TabsList>
                </div>
              </FadeInSection>

              {movie.images.backdrops && (
                <TabsContent value="backdrops">
                  <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4" delay={0.1}>
                    {movie.images.backdrops.slice(0, visibleBackdrops).map((backdrop, index) => (
                      <Card key={index}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video cursor-pointer" onClick={() => setSelectedImage(backdrop.file_path)}>
                            <Image src={`https://image.tmdb.org/t/p/w780${backdrop.file_path}`} alt={`${movie.title} backdrop ${index + 1}`} fill className="object-cover hover:opacity-75 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                  {visibleBackdrops < movie.images.backdrops.length && (
                    <div className="mt-6 text-center">
                      <Button onClick={loadMoreBackdrops} variant="outline" className="min-w-[200px]">
                        Load More Backdrops
                        <span className="ml-2 text-sm text-gray-500">
                          ({visibleBackdrops}/{movie.images.backdrops.length})
                        </span>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              )}

              {movie.images.posters && (
                <TabsContent value="posters">
                  <StaggeredGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" delay={0.08}>
                    {movie.images.posters.slice(0, visiblePosters).map((poster, index) => (
                      <Card key={index}>
                        <CardContent className="p-0">
                          <div className="relative aspect-[2/3] cursor-pointer" onClick={() => setSelectedImage(poster.file_path)}>
                            <Image src={`https://image.tmdb.org/t/p/w342${poster.file_path}`} alt={`${movie.title} poster ${index + 1}`} fill className="object-cover hover:opacity-75 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredGrid>
                  {visiblePosters < movie.images.posters.length && (
                    <div className="mt-6 text-center">
                      <Button onClick={loadMorePosters} variant="outline" className="min-w-[200px]">
                        Load More Posters
                        <span className="ml-2 text-sm text-gray-500">
                          ({visiblePosters}/{movie.images.posters.length})
                        </span>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Trailer Section */}
              {movie.trailers && (
                <TabsContent value="trailers">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {movie.trailers.map((trailer) => (
                      <Card key={trailer.key} className="cursor-pointer flex flex-col md:flex-row items-center bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(trailer.key, trailer.name)}>
                        <div className="w-full md:w-1/3 rounded-lg p-4 flex-shrink-0">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`} alt="Trailer thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="w-full md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left p-4">
                          <h2 className="text-lg font-semibold">{trailer.name}</h2>
                          <p className="text-sm text-gray-500">Release Date: {new Date(trailer.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* teaser Section */}
              {movie.teasers && (
                <TabsContent value="teasers">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {movie.teasers.map((teaser) => (
                      <Card key={teaser.key} className="cursor-pointer flex flex-col md:flex-row items-center bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(teaser.key, teaser.name)}>
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
                  </div>
                </TabsContent>
              )}

              {/* clip Section */}
              {movie.clips && (
                <TabsContent value="clips">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {movie.clips.map((clip) => (
                      <Card key={clip.key} className="cursor-pointer flex flex-col md:flex-row items-center bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(clip.key, clip.name)}>
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
                  </div>
                </TabsContent>
              )}

              {/* BTS Section */}
              {movie.btss && (
                <TabsContent value="btss">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {movie.btss.map((bts) => (
                      <Card key={bts.key} className="cursor-pointer flex flex-col md:flex-row items-center bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(bts.key, bts.name)}>
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
                  </div>
                </TabsContent>
              )}

              {/* Featurettes Section */}
              {movie.featurettes && (
                <TabsContent value="featurettes">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {movie.featurettes.map((featurette) => (
                      <Card key={featurette.key} className="cursor-pointer flex flex-col md:flex-row items-center bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(featurette.key, featurette.name)}>
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
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </ScrollReveal>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="absolute max-w-5xl w-full h-full">
            <Image src={`https://image.tmdb.org/t/p/original${selectedImage}`} alt="Preview" fill className="object-contain" />
          </div>
        </div>
      )}

      <ScrollReveal direction="up" className="container mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommendation</h2>
        <StaggeredGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-8 mb-8" delay={0.1}>
          {movie.recommendations?.results?.map((recommendation) => (
            <RecommendationCard key={recommendation.id} movie={recommendation} media_type={"movie"} showText={false} />
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
