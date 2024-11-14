"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { Play } from "lucide-react";
import { Button } from "./ui/button";

interface FeaturedItem {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  media_type: "movie" | "tv";
}

export function FeaturedCarousel() {
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const autoplay = AutoplayPlugin({ delay: 5000, stopOnInteraction: true });
  const [emblaRef] = useEmblaCarousel({
    loop: true,
  }, [autoplay]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/trending/all/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const data = await response.json();
        if (data.results) {
          setFeatured(data.results.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching featured content:", error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Carousel
        ref={emblaRef}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {featured.map((item) => (
            <CarouselItem key={item.id}>
              <Card className="border-0">
                <CardContent className="relative aspect-[21/9] p-0">
                  <Image src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt={item.title} fill className="object-cover rounded-lg" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-lg" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
                    <p className="text-sm line-clamp-2 mb-4 max-w-2xl">{item.overview}</p>
                    <Button variant="secondary" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}