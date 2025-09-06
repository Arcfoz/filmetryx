export function TVDetailSkeleton() {
  return (
    <div className="container relative">
      {/* Full page background skeleton */}
      <div className="fixed inset-0 -z-10">
        <div className="h-screen w-screen bg-gray-900 animate-pulse" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Section Skeleton */}
      <div className="mx-auto px-4 py-8">
        <div className="relative w-full h-[500px] rounded-t-xl overflow-hidden bg-gray-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="mx-auto px-4 -mt-72 relative">
        <div className="grid md:grid-cols-12 gap-8 max-w-[1400px] mx-auto">
          
          {/* Poster & Action Buttons Skeleton */}
          <div className="md:col-span-3">
            <div className="space-y-4 w-full max-w-[300px] mx-auto">
              {/* Poster skeleton */}
              <div className="aspect-[2/3] relative w-full bg-gray-700 rounded-lg animate-pulse">
                <div className="absolute bottom-2 right-2 z-10">
                  <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />
                </div>
              </div>
              
              {/* Action buttons skeleton */}
              <div className="flex flex-col w-full gap-3">
                <div className="w-full h-10 bg-gray-700 rounded-lg animate-pulse" />
                <div className="w-full h-10 bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="md:col-span-9 text-white">
            <div className="max-w-5xl">
              {/* Title skeleton */}
              <div className="h-10 bg-gray-600 rounded animate-pulse w-3/4 mb-4" />
              
              {/* Meta info skeleton */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-gray-700 rounded-full animate-pulse w-16" />
                <div className="h-6 bg-gray-700 rounded-full animate-pulse w-16" />
                <div className="h-6 bg-gray-700 rounded-full animate-pulse w-16" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <div className="h-6 bg-gray-700 rounded animate-pulse w-24" />
              </div>
              
              {/* Tagline skeleton */}
              <div className="h-6 bg-gray-600 rounded animate-pulse w-2/3 mb-4" />
              
              {/* Overview skeleton */}
              <div className="mb-6">
                <div className="h-6 bg-gray-600 rounded animate-pulse w-32 mb-2" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6" />
                </div>
              </div>
              
              {/* Creator information skeleton */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 bg-gray-600 rounded animate-pulse w-24" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-40" />
                </div>
              </div>
              
              {/* Technical details skeleton */}
              <div className="space-y-4">
                <div className="backdrop-blur-md bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-6 sm:p-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-600 rounded animate-pulse w-16" />
                      <div className="h-4 bg-gray-700 rounded animate-pulse w-24" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-600 rounded animate-pulse w-20" />
                      <div className="h-4 bg-gray-700 rounded animate-pulse w-28" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-600 rounded animate-pulse w-32" />
                      <div className="h-4 bg-gray-700 rounded animate-pulse w-48" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-600 rounded animate-pulse w-28" />
                      <div className="h-4 bg-gray-700 rounded animate-pulse w-36" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast Section Skeleton */}
        <div className="mx-auto mt-12">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-600 rounded animate-pulse w-40" />
            <div className="h-6 bg-gray-700 rounded animate-pulse w-32" />
          </div>
          <div className="backdrop-blur-md bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg">
                  <div className="relative aspect-[2/3] bg-gray-700 rounded-lg animate-pulse" />
                  <div className="p-2 bg-zinc-100/10 rounded-b-lg">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-full mb-1" />
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4 mb-1" />
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seasons Section Skeleton - TV specific */}
        <div className="mx-auto mt-12">
          <div className="h-8 bg-gray-600 rounded animate-pulse w-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-zinc-100/10 border border-zinc-100/20 rounded-lg p-4">
                <div className="flex space-x-4 mb-4">
                  <div className="w-24 h-36 bg-gray-700 rounded animate-pulse flex-shrink-0" />
                  <div className="flex-grow space-y-2">
                    <div className="h-5 bg-gray-600 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3" />
                    <div className="space-y-1 mt-3">
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-full" />
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-5/6" />
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-4/6" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Tabs Skeleton */}
        <div className="mt-12 pb-12">
          <div className="flex justify-center mb-16">
            <div className="flex gap-2">
              <div className="h-10 bg-gray-700 rounded-lg animate-pulse w-24" />
              <div className="h-10 bg-gray-700 rounded-lg animate-pulse w-20" />
              <div className="h-10 bg-gray-700 rounded-lg animate-pulse w-28" />
              <div className="h-10 bg-gray-700 rounded-lg animate-pulse w-20" />
            </div>
          </div>
          
          {/* Media grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-video bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="container mt-12">
        <div className="h-8 bg-gray-600 rounded animate-pulse w-48 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-8 mb-8">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="group relative rounded-xl bg-background-main p-2">
              <div className="relative w-full pb-[150%] overflow-hidden rounded-xl bg-gray-800 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
                <div className="absolute bottom-2 right-2 z-10">
                  <div className="w-9 h-9 rounded-full bg-gray-700 animate-pulse" />
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}