export function MovieCardSkeleton() {
  return (
    <div className="group relative rounded-xl bg-background-main p-2">
      <div className="relative transform">
        <div className="relative w-full pb-[150%] overflow-hidden rounded-xl bg-gray-800 animate-pulse">
          {/* Skeleton for poster image */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
          
          {/* Skeleton for rating */}
          <div className="absolute bottom-2 right-2 z-10">
            <div className="w-9 h-9 rounded-full bg-gray-700 animate-pulse" />
          </div>
        </div>
        
        {/* Skeleton for title and metadata */}
        <div className="mt-2 space-y-2">
          <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ title, count = 6 }: { title: string; count?: number }) {
  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold mb-4 sm:mb-0">{title}</h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 mb-8">
        {Array.from({ length: count }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}