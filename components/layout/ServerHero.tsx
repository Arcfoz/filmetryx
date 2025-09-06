import React from "react";
import { Hero } from "./Hero";

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
  return <Hero initialFeatured={featured} />;
}