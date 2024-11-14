"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Credit {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  vote_average: number;
  job?: string;
  character?: string;
  department?: string;
  media_type: string;
  popularity: number;
}

interface CreditsListProps {
  credits: Credit[];
}

type SortOption = "date" | "rating" | "popularity";

export function CreditsList({ credits }: CreditsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Get unique categories and departments
  const categories = ["all", ...Array.from(new Set(credits.map(credit => credit.media_type)))];
const departments = ["all", ...Array.from(new Set(credits.map(credit => credit.department || "Other")))];

  // Filter credits by category and department
  const filteredCredits = credits.filter(credit => {
    const categoryMatch = selectedCategory === "all" || credit.media_type === selectedCategory;
    const departmentMatch = selectedDepartment === "all" || (credit.department || "Other") === selectedDepartment;
    return categoryMatch && departmentMatch;
  });

  // Sort credits based on selected option
  const sortedCredits = [...filteredCredits].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.vote_average - a.vote_average;
      case "popularity":
        return b.popularity - a.popularity;
      case "date":
        const dateA = new Date(a.release_date || a.first_air_date || "").getTime();
        const dateB = new Date(b.release_date || b.first_air_date || "").getTime();
        return dateB - dateA;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">By Rating</SelectItem>
            <SelectItem value="date">By Release Date</SelectItem>
            <SelectItem value="popularity">By Popularity</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Types" : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department === "all" ? "All Departments" : department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCredits.map((credit) => (
          <Link 
            href={`/${credit.media_type}/${credit.id}`} 
            key={`${credit.id}-${credit.job || credit.character}`}
          >
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="p-4 flex gap-4">
                {credit.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${credit.poster_path}`}
                    alt={credit.title || credit.name || ""}
                    width={60}
                    height={90}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[90px] bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{credit.title || credit.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {credit.job || credit.character}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {credit.department || "Other"}
                  </p>
                  {(credit.release_date || credit.first_air_date) && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(credit.release_date || credit.first_air_date || "").getFullYear()}
                    </p>
                  )}
                  {credit.vote_average > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        {credit.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}