import { fetchFilm } from "@/lib/tmdb";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await fetchFilm(params.slug, "movie");

  const releaseDate = new Date(movie.release_date);
  const releaseYear = releaseDate.getFullYear();

  return {
    title: `${movie.title} (${(releaseYear)}) `,
  };
}

export default function MovieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
