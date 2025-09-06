export function HeroSkeleton() {
  return (
    <section className="relative left-1/2 transform -translate-x-1/2 overflow-hidden w-screen -mx-2">
      <div className="w-[calc(100vw)] overflow-hidden">
        <div className="relative h-[500px] w-full bg-gray-800 animate-pulse">
          {/* Skeleton gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
          
          {/* Skeleton content overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191A39] from-0% to-transparent to-60% px-5">
            <div className="container mx-auto h-full relative">
              <div className="flex flex-col justify-end h-full p-6 max-w-2xl pb-20 space-y-4">
                {/* Title skeleton */}
                <div className="h-8 bg-gray-600 rounded animate-pulse w-3/4" />
                
                {/* Overview skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6" />
                </div>
                
                {/* Rating skeleton */}
                <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Navigation dots skeleton */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex justify-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
            <div className="flex space-x-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
              ))}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}