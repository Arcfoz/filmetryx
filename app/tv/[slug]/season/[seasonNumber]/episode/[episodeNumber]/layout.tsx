import { fetchTvEpisode} from "@/lib/tmdb";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string; seasonNumber: string; episodeNumber: string  } }): Promise<Metadata> {
  const episodeTv = await fetchTvEpisode(params.slug, params.seasonNumber, params.episodeNumber);

  const releaseDate = new Date(episodeTv.air_date);
  const releaseYear = releaseDate.getFullYear();

  return {
    title: `${episodeTv.tvName} S${params.seasonNumber}E${params.episodeNumber}: ${episodeTv.name} (${releaseYear})`,
  };
}

export default function TvEpisodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
