import { getCollection } from "@/lib/tmdb";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getCollection(parseInt(params.id));

  return {
    title: `${data.name}`,
  };
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
