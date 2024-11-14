"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MediaType } from "@/types/movie";

interface SearchDropdownProps {
  results: MediaType[];
  onClose: () => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export function SearchDropdown({ results, onClose, setSearchValue }: SearchDropdownProps) {
  const router = useRouter();

  const handleItemClick = (item: MediaType) => {
    const route = `/${item.media_type}/${item.id}`;
    router.push(route);
    onClose();
    setSearchValue("");
  };

  if (results.length === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 bg-[#0d0a12]  rounded-lg z-50 p-4 ">
        <p className="text-center text-muted-foreground">No results found</p>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 bg-[#0d0a12] shadow-lg rounded-lg z-50">
      <ScrollArea className="h-[60vh] rounded-lg">
        <div className="p-4 space-y-4">
          {results.map((item) => (
            <div key={item.id} className="flex gap-4 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer" onClick={() => handleItemClick(item)}>
              <div className="relative h-24 w-16 flex-shrink-0">
                {item.poster_path ? (
                  <Image src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name || "Media poster"} fill className="object-cover rounded" sizes="(max-width: 768px) 64px, 64px" />
                ) : (
                  <div className="w-full h-full bg-muted rounded flex items-center justify-center text-xs text-center p-1">No poster</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium truncate">{item.title || item.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-sm">{item.vote_average?.toFixed(1) ?? "0.0"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="capitalize">{item.media_type}</span>
                  <span>•</span>
                  <span>{item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date || "").getFullYear() : "N/A"}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
