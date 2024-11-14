import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const personResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/person/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const personData = await personResponse.json();

  return {
    title: `${personData.name}`,
  };
}

export default function PersonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
