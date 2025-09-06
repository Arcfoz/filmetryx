import { HeroSkeleton } from "@/components/ui/HeroSkeleton";
import { MovieGridSkeleton } from "@/components/ui/MovieCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191A39] from-30%">
      <main className="container mx-auto">
        <HeroSkeleton />
        <MovieGridSkeleton title="Movie Popular" count={6} />
        <MovieGridSkeleton title="Movie Top Rated" count={6} />
        <MovieGridSkeleton title="TV Popular" count={6} />
        <MovieGridSkeleton title="TV Top Rated" count={6} />
      </main>
    </div>
  );
}