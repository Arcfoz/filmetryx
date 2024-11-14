"use client";
import { DetailTv } from "@/types/movie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { addToFavorites, checkIfFavorite, fetchFilm } from "@/lib/tmdb";
import { toast } from "sonner";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/Footer";
import { CircularRating } from "@/components/CircularRating";
import { GlobeIcon, HeartIcon, HeartOffIcon, User } from "lucide-react";
import { SelectedVideo } from "@/app/movie/[slug]/page";

const ITEMS_PER_PAGE = 10;

export default function TvPage({ params }: { params: { slug: string } }) {
  const [tv, setTv] = useState<DetailTv | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleBackdrops, setVisibleBackdrops] = useState(ITEMS_PER_PAGE);
  const [visiblePosters, setVisiblePosters] = useState(ITEMS_PER_PAGE);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchFilm(params.slug, "tv");
        setTv(movieData);
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
      if (tv && session) {
        try {
          if (session?.user) {
            const isMovieFavorite = await checkIfFavorite(tv.id, session.user.session_id, "tv");
            setIsFavorite(isMovieFavorite);
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [tv, session]);

  const loadMoreBackdrops = () => {
    setVisibleBackdrops((prev) => prev + ITEMS_PER_PAGE);
  };

  const loadMorePosters = () => {
    setVisiblePosters((prev) => prev + ITEMS_PER_PAGE);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!tv) {
    return <div className="flex items-center justify-center min-h-screen">!!!</div>;
  }

  const releaseDate = new Date(tv.first_air_date);
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const releaseYear = releaseDate.getFullYear();

  const handleFavoriteClick = async (tvId: number, isFavorite: boolean) => {
    if (!session) {
      toast.info("Please login to add favorite", {
        position: "bottom-center",
      });
      return;
    }

    try {
      if (session?.user?.session_id) {
        const response = await addToFavorites(tvId, session.user.session_id, isFavorite, "tv");
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
        {tv.backdrop_path ? <Image src={`https://image.tmdb.org/t/p/w500${tv.backdrop_path}`} alt="" fill className="object-cover brightness-[0.3] blur-3xl" priority /> : <div className="h-screen w-screen bg-black" />}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      {/* Hero Section with Backdrop */}
      <div className="mx-auto px-4 py-8">
        <div className="relative w-full h-[500px] rounded-t-xl overflow-hidden">
          <div className="absolute inset-0">
            {tv.backdrop_path ? <Image src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`} alt="" fill className="object-cover" priority /> : <div className="h-full w-full bg-black" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent " />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 -mt-72 relative">
        <div className="grid md:grid-cols-12 gap-8 max-w-[1400px] mx-auto ">
          {/* Poster & Action Buttons */}
          <div className="md:col-span-3">
            <div className="space-y-4 w-full max-w-[300px] mx-auto">
              <div className="aspect-[2/3] relative w-full">
                <Image src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} alt={tv.name ?? ""} fill className="rounded-lg shadow-xl object-cover" priority />
                <div className="absolute bottom-2 right-2 z-10">
                  <CircularRating rating={tv.vote_average || 0} size={48} />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-3">
                {tv.homepage && (
                  <Link href={tv.homepage} target="_blank" className="w-full">
                    <Button variant={"outline"} className="flex items-center justify-center w-full py-2">
                      <GlobeIcon className="w-5 h-5 mr-2" />
                      Website
                    </Button>
                  </Link>
                )}
                <Button variant={isFavorite ? "outline" : "default"} onClick={() => handleFavoriteClick(tv.id, isFavorite)} className="flex items-center justify-center w-full py-2">
                  {isFavorite ? <HeartOffIcon className="w-5 h-5 mr-2" /> : <HeartIcon className="w-5 h-5 mr-2" />}
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-9 text-white">
            <div className="max-w-5xl ">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {tv.name} ({releaseYear})
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 text-sm">
                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center items-center">
                  {tv.genres && tv.genres.length > 0 && (
                    <>
                      {tv.genres.map((genre) => (
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

              {tv.tagline && <p className="text-xl text-gray-200 italic mb-4">{tv.tagline}</p>}

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Overview</h2>
                <p className="text-gray-200 leading-relaxed">{tv.overview}</p>
              </div>

              {/* Creator Information */}
              <div className="space-y-4 mb-6">
                {tv.created_by && tv.created_by && (
                  <div className="mb-6">
                    <span className="font-bold">Creator{tv.created_by.length > 1 ? "s" : ""}:</span>{" "}
                    {tv.created_by.map((creator, index) => (
                      <span key={creator.id}>
                        <Link href={`/person/${creator.id}`} className="text-blue-300 hover:text-blue-400">
                          {creator.name}
                        </Link>
                        {index < tv.created_by.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Technical */}
              <div className="space-y-4">
                <div className="backdrop-blur-md bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-6 sm:p-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Audio</h3>
                      <p className="text-gray-200">{tv.spoken_languages.map((lang) => lang.english_name).join(", ")}</p>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Status</h3>
                      <p className="text-gray-200">{tv.status}</p>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Production Companies</h3>
                      <p className="text-gray-200">{tv.production_companies.map((company) => company.name).join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mx-auto mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Tv Cast</h2>
            <Link href={`/tv/${params.slug}/cast`} className="text-blue-600 hover:text-blue-800 font-medium">
              See Full Cast
            </Link>
          </div>
          <div className="backdrop-blur-md bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {tv.creditsTv &&
                tv.creditsTv.cast &&
                tv.creditsTv.cast.slice(0, 15).map((member) => (
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
                      {member.character && <h2 className="text-sm md:text-base text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">as {member.character}</h2>}
                      {member.total_episode_count && <p className="text-sm md:text-base text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">{member.total_episode_count} episodes</p>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Seasons Section */}
        <div className="mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Seasons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tv.seasons) &&
              tv.seasons.map((season) => (
                <Link href={`/tv/${params.slug}/season/${season.season_number}`} key={season.id}>
                  <Card className="hover:shadow-lg transition-shadow bg-zinc-100/10 hover:bg-zinc-100/20 border border-zinc-100/20 h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex space-x-4 mb-4">
                        <div className="relative w-24 h-36 flex-shrink-0">
                          {season.poster_path ? (
                            <Image src={`https://image.tmdb.org/t/p/w185${season.poster_path}`} alt={season.name} fill className="object-cover rounded-md" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{season.name}</h3>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p>{season.episode_count} Episodes</p>
                            {season.air_date && (
                              <p>
                                Air Date:{" "}
                                {new Date(season.air_date).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {season.overview && <p className="text-sm mt-auto line-clamp-2">{season.overview}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* Media Section */}
        {tv.images && (tv.images.backdrops || tv.images.posters) && (
          <div className="mt-12 pb-12">
            <Tabs defaultValue="backdrops" className="w-full">
              <div className="flex justify-center">
                <TabsList className="mb-24 bg-transparent p-3 flex flex-wrap justify-center gap-2 sm:mb-16">
                  {tv.images.backdrops && (
                    <TabsTrigger value="backdrops" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Backdrops ({tv.images.backdrops.length})
                    </TabsTrigger>
                  )}
                  {tv.images.posters && (
                    <TabsTrigger value="posters" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Posters ({tv.images.posters.length})
                    </TabsTrigger>
                  )}
                  {tv.trailers && (
                    <TabsTrigger value="trailers" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Trailers ({tv.trailers.length})
                    </TabsTrigger>
                  )}
                  {tv.teasers && (
                    <TabsTrigger value="teasers" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Teasers ({tv.teasers?.length})
                    </TabsTrigger>
                  )}
                  {tv.clips && (
                    <TabsTrigger value="clips" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Clips ({tv.clips?.length})
                    </TabsTrigger>
                  )}
                  {tv.btss && (
                    <TabsTrigger value="btss" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Behind The Scenes ({tv.btss?.length})
                    </TabsTrigger>
                  )}
                  {tv.featurettes && (
                    <TabsTrigger value="featurettes" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                      Featurettes ({tv.featurettes?.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {tv.images.backdrops && (
                <TabsContent value="backdrops">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {tv.images.backdrops.slice(0, visibleBackdrops).map((backdrop, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative aspect-video cursor-pointer" onClick={() => setSelectedImage(backdrop.file_path)}>
                            <Image src={`https://image.tmdb.org/t/p/w780${backdrop.file_path}`} alt={`${tv.name} backdrop ${index + 1}`} fill className="object-cover hover:opacity-75 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {visibleBackdrops < tv.images.backdrops.length && (
                    <div className="mt-6 text-center">
                      <Button onClick={loadMoreBackdrops} variant="outline" className="min-w-[200px]">
                        Load More Backdrops
                        <span className="ml-2 text-sm text-gray-500">
                          ({visibleBackdrops}/{tv.images.backdrops.length})
                        </span>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              )}

              {tv.images.posters && (
                <TabsContent value="posters">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {tv.images.posters.slice(0, visiblePosters).map((poster, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative aspect-[2/3] cursor-pointer" onClick={() => setSelectedImage(poster.file_path)}>
                            <Image src={`https://image.tmdb.org/t/p/w342${poster.file_path}`} alt={`${tv.name} poster ${index + 1}`} fill className="object-cover hover:opacity-75 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {visiblePosters < tv.images.posters.length && (
                    <div className="mt-6 text-center">
                      <Button onClick={loadMorePosters} variant="outline" className="min-w-[200px]">
                        Load More Posters
                        <span className="ml-2 text-sm text-gray-500">
                          ({visiblePosters}/{tv.images.posters.length})
                        </span>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Trailer Section */}
              {tv.trailers && (
                <TabsContent value="trailers">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {tv.trailers.map((trailer) => (
                      <Card key={trailer.key} className="cursor-pointer flex flex-col md:flex-row items-center hover:bg-zinc-100/20 bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(trailer.key, trailer.name)}>
                        <div className="w-full md:w-1/3 rounded-lg p-4 flex-shrink-0">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`} alt="Trailer thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="w-full md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left p-4">
                          <h2 className="text-lg font-semibold">{trailer.name}</h2>
                          <p className="text-sm text-gray-400">Release Date: {new Date(trailer.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* teaser Section */}
              {tv.teasers && (
                <TabsContent value="teasers">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {tv.teasers.map((teaser) => (
                      <Card key={teaser.key} className="cursor-pointer flex flex-col md:flex-row items-center hover:bg-zinc-100/20  bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(teaser.key, teaser.name)}>
                        <div className="w-full md:w-1/3 rounded-lg p-4 flex-shrink-0">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${teaser.key}/hqdefault.jpg`} alt="Teaser thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="w-full md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left p-4">
                          <h2 className="text-lg font-semibold">{teaser.name}</h2>
                          <p className="text-sm text-gray-400">Release Date: {new Date(teaser.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* clip Section */}
              {tv.clips && (
                <TabsContent value="clips">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {tv.clips.map((clip) => (
                      <Card key={clip.key} className="cursor-pointer flex flex-col md:flex-row items-center hover:bg-zinc-100/20  bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(clip.key, clip.name)}>
                        <div className="w-full md:w-1/3 rounded-lg p-4 flex-shrink-0">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${clip.key}/hqdefault.jpg`} alt="Clip thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="w-full md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left p-4">
                          <h2 className="text-lg font-semibold">{clip.name}</h2>
                          <p className="text-sm text-gray-400">Release Date: {new Date(clip.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* BTS Section */}
              {tv.btss && (
                <TabsContent value="btss">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {tv.btss.map((bts) => (
                      <Card key={bts.key} className="cursor-pointer flex flex-col md:flex-row items-center hover:bg-zinc-100/20  bg-zinc-100/10 border border-zinc-100/20 rounded-lg" onClick={() => openDialog(bts.key, bts.name)}>
                        <div className="w-full md:w-1/3 rounded-lg p-4 flex-shrink-0">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${bts.key}/hqdefault.jpg`} alt="BTS thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="w-full md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left p-4">
                          <h2 className="text-lg font-semibold">{bts.name}</h2>
                          <p className="text-sm text-gray-400">Release Date: {new Date(bts.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Featurettes Section */}
              {tv.featurettes && (
                <TabsContent value="featurettes">
                  <div className="grid mx-auto gap-6 max-w-4xl">
                    {tv.featurettes.map((featurette) => (
                      <Card
                        key={featurette.key}
                        className="cursor-pointer flex flex-col md:flex-row items-center hover:bg-zinc-100/20  bg-zinc-100/10 border border-zinc-100/20 rounded-lg"
                        onClick={() => openDialog(featurette.key, featurette.name)}
                      >
                        <div className="w-full md:w-1/3 rounded-lg p-4 flex-shrink-0">
                          <div className="relative w-full pb-[56.25%]">
                            <Image src={`https://img.youtube.com/vi/${featurette.key}/hqdefault.jpg`} alt="BTS thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="w-full md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left p-4">
                          <h2 className="text-lg font-semibold">{featurette.name}</h2>
                          <p className="text-sm text-gray-400">Release Date: {new Date(featurette.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
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

      <div className="container mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommendation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-8 mb-8">
          {tv.recommendations?.results?.map((recommendation) => (
            <RecommendationCard key={recommendation.id} movie={recommendation} media_type={"tv"} showText={false} />
          ))}
        </div>
      </div>

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
