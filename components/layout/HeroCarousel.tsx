"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { type CarouselApi } from "@/components/ui/carousel";
import { DotButton, useDotButton } from "@/components/ui/EmblaCarouselDotButton";
import { CircularRating } from "../CircularRating";
import { motion, AnimatePresence } from "framer-motion";
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

interface HeroCarouselProps {
  featured: FeaturedItem[];
}

export function HeroCarousel({ featured }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [Autoplay, setAutoplay] = useState<typeof import("embla-carousel-autoplay").default | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);
  const { ref: parallaxRef, y: parallaxY } = useParallax(50);

  // Dynamically import Autoplay after component mounts
  useEffect(() => {
    import("embla-carousel-autoplay").then((module) => {
      setAutoplay(() => module.default);
    });
  }, []);

  // Track current slide for animations
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      plugins={Autoplay ? [Autoplay({ delay: 4000 })] : []}
      setApi={setApi}
      opts={{
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {featured.map((item, index) => (
          <CarouselItem key={item.id} className="pl-0">
            <div className="relative" ref={index === 0 ? parallaxRef : undefined}>
              <Link href={`movie/${item.id}`}>
                <div className="relative h-[500px] w-full overflow-hidden">
                  <motion.div
                    style={{ y: index === 0 ? parallaxY : 0 }}
                    className="absolute inset-0"
                  >
                    <Image 
                      fill 
                      src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} 
                      alt={item.title} 
                      className="object-cover scale-110" 
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191A39] from-0% to-transparent to-60% px-5">
                    <div className="container mx-auto h-full relative">
                      <AnimatePresence mode="wait">
                        {currentSlide === index && (
                          <motion.div 
                            key={`slide-${index}`}
                            className="flex flex-col justify-end h-full p-6 max-w-2xl pb-20"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ 
                              duration: 0.8, 
                              ease: "easeOut",
                              staggerChildren: 0.1
                            }}
                          >
                            <motion.h2 
                              className="text-4xl font-bold text-white mb-4"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            >
                              {item.title || item.name} ({new Date(item.release_date).getFullYear()})
                            </motion.h2>
                            <motion.p 
                              className="text-gray-200 text-lg mb-4 line-clamp-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.4 }}
                            >
                              {item.overview}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.6 }}
                            >
                              <CircularRating rating={item.vote_average || 0} size={48} />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center">
        <motion.div 
          className="flex items-center gap-2 sm:gap-4 flex-nowrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0 backdrop-blur-sm bg-black/20 hover:bg-black/40 transition-colors duration-300 h-8 w-8" />
          </motion.div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {scrollSnaps.map((_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <DotButton 
                  onClick={() => onDotButtonClick(index)} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex 
                      ? "bg-white shadow-lg scale-125" 
                      : "bg-gray-400/50 hover:bg-gray-400 hover:scale-110"
                  }`} 
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <CarouselNext className="relative left-0 top-0 translate-x-0 translate-y-0 backdrop-blur-sm bg-black/20 hover:bg-black/40 transition-colors duration-300 h-8 w-8" />
          </motion.div>
        </motion.div>
      </div>
    </Carousel>
  );
}