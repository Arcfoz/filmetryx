"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MovieCard } from "@/components/layout/MovieCard";
import { searchMedia } from "@/lib/tmdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: "movie" | "tv";
  backdrop_path: string;
  first_air_date: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchContent(query);
    }
  }, [query]);

  const searchContent = async (searchQuery: string) => {
    try {
      setLoading(true);
      const searchResults = await searchMedia(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] bg-muted"></div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 p-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const movieResults = results.filter((result) => result.media_type === "movie");
  const tvResults = results.filter((result) => result.media_type === "tv");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for: {query}</h1>
      {results.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg">No results found for your search.</p>
      ) : (
        <>
          <div className="mt-12 pb-12">
            <Tabs defaultValue="movies" className="w-full">
              <div className="flex justify-center">
                <TabsList className="mb-24 bg-transparent p-3 flex flex-wrap justify-center gap-2 sm:mb-16">
                  <TabsTrigger value="movies" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                    Movie ({movieResults.length})
                  </TabsTrigger>
                  <TabsTrigger value="tvs" className="data-[state=active]:bg-zinc-100/10 data-[state=active]:text-white  transition-all duration-300 ease-in-out text-sm md:text-base lg:text-lg px-4 py-2 rounded-lg">
                    Tv ({tvResults.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="movies">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-8 mb-8">
                  {movieResults.map((result) => (
                    <MovieCard key={result.id} movie={result} media_type="movie" showText={true} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tvs">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-8 mb-8">
                  {tvResults.map((result) => (
                    <MovieCard key={result.id} movie={result} media_type="tv" showText={true} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <CardContent className="p-0">
                    <div className="relative aspect-[2/3] bg-muted"></div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 p-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </main>
  );
}
