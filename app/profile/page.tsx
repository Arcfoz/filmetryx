"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Avvvatars from "avvvatars-react";
import { Movies } from "@/types/movie";
import { MovieCard } from "@/components/layout/MovieCard";
import { fetchAccountDetails, fetchFavoritesMovies, fetchFavoritesTv, removeFromFavorites } from "@/lib/tmdb";
import { useSession } from "next-auth/react";

interface AccountDetails {
  id: number;
  name: string;
  username: string;
  include_adult: boolean;
  iso_3166_1: string;
  iso_639_1: string;
}

export default function ProfilePage() {
  const [favoritesMovies, setFavoritesMovies] = useState<Movies[]>([]);
  const [favoritesTv, setFavoritesTv] = useState<Movies[]>([]);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const init = async () => {
      try {
        if (!session?.user?.session_id) throw new Error("Session ID is undefined");
        const [accountData, moviesData, tvData] = await Promise.all([fetchAccountDetails(session.user.session_id), fetchFavoritesMovies(session.user.session_id), fetchFavoritesTv(session.user.session_id)]);

        setAccountDetails(accountData);
        setFavoritesMovies(moviesData);
        setFavoritesTv(tvData);
      } catch (error) {
        console.error("Error initializing profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      init();
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
      </div>
    );
  }

  const handleRemoveFromFavorites = async (movieId: number, media_type: string) => {
    if (!session) return;

    try {
      if (!session?.user) throw new Error("User is undefined");
      const response = await removeFromFavorites(movieId, session.user.session_id, media_type);
      if (response.success) {
        if (media_type === "movie") {
          setFavoritesMovies(favoritesMovies.filter((movie) => movie.id !== movieId));
        } else {
          setFavoritesTv(favoritesTv.filter((tv) => tv.id !== movieId));
        }
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  // if (loading) {
  //   return (
  //     <main className="min-h-screen bg-background">
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="animate-pulse">
  //           <div className="flex items-center gap-6 mb-8">
  //             <div className="w-32 h-32 rounded-full bg-muted"></div>
  //             <div className="space-y-3">
  //               <div className="h-6 w-48 bg-muted rounded"></div>
  //               <div className="h-4 w-32 bg-muted rounded"></div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            {accountDetails?.username ? (
              <Avvvatars value={accountDetails.username} style="shape" size={128} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                <UserCircle className="w-16 h-16" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{accountDetails?.name || accountDetails?.username}</h1>
            <p className="text-muted-foreground">Username: {accountDetails?.username}</p>
            <p className="text-muted-foreground">Country: {accountDetails?.iso_3166_1}</p>
            <p className="text-muted-foreground">Language: {accountDetails?.iso_639_1}</p>
          </div>
        </div>

        <Tabs defaultValue="movie" className="w-full">
          <div className="flex justify-center">
            <TabsList className="mb-24 bg-transparent p-3 flex flex-wrap justify-center gap-2 sm:mb-16">
              <TabsTrigger className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg" value="movie">
                Favorite Movies
              </TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg" value="tv">
                Favorite Tv
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="movie">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-8 mb-8  ">
              {favoritesMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} media_type={"movie"} showText={false}>
                  <Button onClick={() => handleRemoveFromFavorites(movie.id, "movie")} variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </MovieCard>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tv">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-8 mb-8  ">
              {favoritesTv.map((tv) => (
                <MovieCard key={tv.id} movie={tv} media_type={"tv"} showText={false}>
                  <Button onClick={() => handleRemoveFromFavorites(tv.id, "tv")} variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </MovieCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
