import { fetchFilm } from "@/lib/tmdb";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tv = await fetchFilm(params.slug, "tv");

  const releaseDate = new Date(tv.first_air_date);
  const releaseYear = releaseDate.getFullYear();

  return {
    title: `${tv.name} (${(releaseYear)})`,
  };
}

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
