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

interface HeroProps {
  initialFeatured?: FeaturedItem[];
}

export function Hero({ initialFeatured = [] }: HeroProps) {
  const [featured, setFeatured] = useState<FeaturedItem[]>(initialFeatured);
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayPlugin] = useState(() => Autoplay({ delay: 4000 }));

  useEffect(() => {
    // Only fetch data if no initial data was provided
    if (initialFeatured.length === 0) {
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
    }
  }, [initialFeatured.length]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const { selectedIndex } = useDotButton(api);
  
  // Use featured array for immediate dots, fallback to API when available
  const totalSlides = featured.length;
  const activeSlide = api ? selectedIndex : currentSlide;
  
  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    } else {
      setCurrentSlide(index);
    }
  };

  return (
    <section className="relative left-1/2 transform -translate-x-1/2 overflow-hidden w-screen -mx-2">
      <div className="w-[calc(100vw)] overflow-hidden">
        <Carousel
          plugins={[autoplayPlugin]}
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
                    <div className="relative h-[500px] w-full overflow-hidden">
                      <div className="absolute inset-0">
                        <Image fill src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`} alt={item.title} className="object-cover scale-110" priority />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191A39] from-0% to-transparent to-60% px-5">
                        <div className="container mx-auto h-full relative">
                          <div className="flex flex-col justify-end h-full p-6 max-w-2xl pb-20">
                            <h2 className="text-4xl font-bold text-white mb-4">
                              {item.title || item.name} ({new Date(item.release_date).getFullYear()})
                            </h2>
                            <p className="text-gray-200 text-lg mb-4 line-clamp-3">
                              {item.overview}
                            </p>
                            <div>
                              <CircularRating rating={item.vote_average || 0} size={48} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex justify-center items-center space-x-2">
            <CarouselPrevious className="mr-2" />
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalSlides }, (_, index) => (
                <DotButton 
                  key={index} 
                  onClick={() => handleDotClick(index)} 
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeSlide ? "bg-white" : "bg-gray-400/50 hover:bg-gray-400"
                  }`} 
                />
              ))}
            </div>
            <CarouselNext className="ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
