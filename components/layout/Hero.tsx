"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { type CarouselApi } from "@/components/ui/carousel";
import { DotButton, useDotButton } from "@/components/ui/EmblaCarouselDotButton";
import { CircularRating } from "../CircularRating";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useScrollAnimation";

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
  const { ref: parallaxRef, y: parallaxY } = useParallax(30);

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
                <div className="relative" ref={parallaxRef}>
                  <Link href={`movie/${item.id}`}>
                    <div className="relative h-[500px] w-full overflow-hidden">
                      <motion.div 
                        style={{ y: parallaxY }}
                        className="absolute inset-0"
                      >
                        <Image fill src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt={item.title} className="object-cover scale-110" priority />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191A39] from-0% to-transparent to-60% px-5">
                        <div className="container mx-auto h-full relative">
                          <motion.div 
                            className="flex flex-col justify-end h-full p-6 max-w-2xl pb-20"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 1, 
                              ease: "easeOut",
                              delay: 0.3
                            }}
                          >
                            <motion.h2 
                              className="text-4xl font-bold text-white mb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                            >
                              {item.title || item.name} ({new Date(item.release_date).getFullYear()})
                            </motion.h2>
                            <motion.p 
                              className="text-gray-200 text-lg mb-4 line-clamp-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.7 }}
                            >
                              {item.overview}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: 0.9 }}
                            >
                              <CircularRating rating={item.vote_average || 0} size={48} />
                            </motion.div>
                          </motion.div>
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
