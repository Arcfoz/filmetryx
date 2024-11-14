"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { type CarouselApi } from "@/components/ui/carousel";
import { DotButton, useDotButton } from "@/components/ui/EmblaCarouselDotButton";
import { CircularRating } from "../CircularRating";

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

export function Hero() {
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/trending/all/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const data = await response.json();

        if (data.results) {
          const filteredResults = data.results.filter((item: FeaturedItem) => item.media_type === "movie");
          setFeatured(filteredResults.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching featured content:", error);
      }
    };

    fetchFeatured();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  return (
    <section className="relative left-1/2 transform -translate-x-1/2 overflow-hidden w-screen -mx-2">
      <div className="w-[calc(100vw)] overflow-hidden">
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          setApi={setApi}
          opts={{
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featured.map((item) => (
              <CarouselItem key={item.id} className="pl-0">
                <div className="relative">
                  <Link href={`movie/${item.id}`}>
                    <div className="relative h-[500px] w-full">
                      <Image fill src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt={item.title} className="object-cover" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191A39] from-0% to-transparent to-60% px-5">
                        <div className="container mx-auto h-full relative">
                          <div className="flex flex-col justify-end h-full p-6 max-w-2xl pb-20">
                            <h2 className="text-4xl font-bold text-white mb-4">
                              {item.title || item.name} ({new Date(item.release_date).getFullYear()})
                            </h2>
                            <p className="text-gray-200 text-lg mb-4 line-clamp-3">{item.overview}</p>
                            <CircularRating rating={item.vote_average || 0} size={48} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex justify-center space-x-2">
            <CarouselPrevious className="mr-2" />
            <div className="space-x-1">
              {scrollSnaps.map((_, index) => (
                <DotButton key={index} onClick={() => onDotButtonClick(index)} className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? "bg-white" : "bg-gray-400/50 hover:bg-gray-400"}`} />
              ))}
            </div>
            <CarouselNext className="ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
