import { HeroSkeleton } from "@/components/ui/HeroSkeleton";
import { MovieGridSkeleton } from "@/components/ui/MovieCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191A39] from-30%">
      <main className="container mx-auto">
        <HeroSkeleton />
        
        {/* Static skeleton for first grid to match layout */}
        <section className="mb-8">
          <div className="sticky top-20 z-10 mb-8">
            <div className="w-fit py-2 px-4 backdrop-blur-md bg-[#191A39]/95 rounded-full border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold relative text-white">
                Movie Popular
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#82C4FF] w-full" />
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 mb-8">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="group relative rounded-xl bg-background-main p-2">
                <div className="relative w-full pb-[150%] overflow-hidden rounded-xl bg-gray-800">
                  <div className="absolute bottom-2 right-2 z-10">
                    <div className="w-9 h-9 rounded-full bg-gray-700" />
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <MovieGridSkeleton title="Movie Top Rated" count={6} />
        <MovieGridSkeleton title="TV Popular" count={6} />
        <MovieGridSkeleton title="TV Top Rated" count={6} />
      </main>
    </div>
  );
}