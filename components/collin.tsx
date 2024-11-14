"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CollectionLinkProps {
  collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
}

export function CollectionLink({ collection }: CollectionLinkProps) {
  return (
    <Link href={`/collection/${collection.id}`}>
      <Card className="group relative overflow-hidden">
        <div className="relative h-[200px] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${collection.backdrop_path}`}
            alt={collection.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center justify-between p-6 text-white">
          <div>
            <p className="text-sm font-medium text-white/70">Part of</p>
            <h3 className="text-xl font-bold">{collection.name}</h3>
          </div>
          <ArrowRight className="h-6 w-6 transform transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}