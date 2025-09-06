import React from "react";
import { HeroCarousel } from "./HeroCarousel";

interface FeaturedItem {
  id: number;
  title: string;
  name?: string;
  release_date: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  media_type: "movie";
}

async function fetchFeaturedContent(): Promise<FeaturedItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_URL}/trending/all/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      { next: { revalidate: 600 } } // Cache for 10 minutes
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch featured content");
    }
    
    const data = await response.json();
    
    if (data.results) {
      const filteredResults = data.results.filter((item: FeaturedItem) => item.media_type === "movie");
      return filteredResults.slice(0, 6);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching featured content:", error);
    return [];
  }
}

export async function ServerHero() {
  const featured = await fetchFeaturedContent();

  if (featured.length === 0) {
    return (
      <section className="relative left-1/2 transform -translate-x-1/2 overflow-hidden w-screen -mx-2">
        <div className="w-[calc(100vw)] overflow-hidden h-[500px] bg-gradient-to-b from-[#191A39] flex items-center justify-center">
          <p className="text-white text-xl">Unable to load featured content</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative left-1/2 transform -translate-x-1/2 overflow-hidden w-screen -mx-2">
      <div className="w-[calc(100vw)] overflow-hidden">
        <HeroCarousel featured={featured} />
      </div>
    </section>
  );
}