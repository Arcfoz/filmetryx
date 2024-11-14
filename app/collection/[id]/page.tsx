"use client";

import { useEffect, useState } from 'react';
import { Collection, getCollection } from '@/lib/tmdb';
import Image from 'next/image';
import { MovieCard } from '@/components/layout/MovieCard';

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await getCollection(parseInt(params.id));
        setCollection(data);
      } catch (error) {
        console.error('Failed to fetch collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [params.id]);

  if (loading || !collection) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        Loading...
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="relative h-[400px] w-full rounded-xl mb-8">
        <Image
          src={`https://image.tmdb.org/t/p/original${collection.backdrop_path}`}
          alt={collection.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">{collection.name}</h1>
          <p className="text-lg text-gray-200 max-w-2xl">{collection.overview}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Movies in Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collection.parts.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}