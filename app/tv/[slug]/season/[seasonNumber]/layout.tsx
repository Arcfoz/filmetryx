import { fetchTvSeason } from "@/lib/tmdb";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string; seasonNumber: string  } }): Promise<Metadata> {
  const seasonTv = await fetchTvSeason(params.slug, params.seasonNumber);

  const releaseDate = new Date(seasonTv.air_date);
  const releaseYear = releaseDate.getFullYear();

  return {
    title: `${seasonTv.tvName}: ${seasonTv.name} (${releaseYear})`,
  };
}

export default function SeasonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
