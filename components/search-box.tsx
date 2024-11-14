"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchDropdown } from "@/components/search-dropdown";
import { MediaType } from "@/types/movie";
import { searchMedia } from "@/lib/tmdb";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [results, setResults] = useState<MediaType[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim()) {
        try {
          const searchResults = await searchMedia(debouncedSearch);
          setResults(searchResults);
          setIsDropdownOpen(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } 
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        setIsDropdownOpen(false);
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder='Search for movies or TV shows (Press Enter for separate results)'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 py-6 text-lg"
          onFocus={() => searchTerm.trim() && setIsDropdownOpen(true)}
        />
      </div>
      {isDropdownOpen && (
        <SearchDropdown
          results={results}
          onClose={() => setIsDropdownOpen(false)}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
      )}
    </div>
  );
}