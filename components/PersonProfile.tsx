"use client";

import Image from "next/image";
import { CalendarIcon, MapPinIcon, TrendingUpIcon } from "lucide-react";

interface Person {
  name: string;
  profile_path: string | null;
  known_for_department: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  popularity: number;
}

interface PersonProfileProps {
  person: Person;
}

export function PersonProfile({ person }: PersonProfileProps) {
  const calculateAge = (birthday: string, deathday: string | null) => {
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    const age = Math.floor(
      (end.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={person.profile_path 
            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
            : "https://via.placeholder.com/500x750.png?text=No+Image"
          }
          alt={person.name}
          fill
          className="rounded-lg object-cover"
          priority
        />
      </div>

      <div className="bg-card rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Personal Info</h2>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Known For</h3>
          <p className="text-foreground">{person.known_for_department}</p>
        </div>

        {person.birthday && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Born</h3>
            <p className="text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {new Date(person.birthday).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {!person.deathday && ` (${calculateAge(person.birthday, null)} years old)`}
            </p>
          </div>
        )}

        {person.deathday && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Died</h3>
            <p className="text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {new Date(person.deathday).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {` (${calculateAge(person.birthday!, person.deathday)} years old)`}
            </p>
          </div>
        )}

        {person.place_of_birth && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Place of Birth</h3>
            <p className="text-foreground flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              {person.place_of_birth}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Popularity</h3>
          <p className="text-foreground flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4" />
            {person.popularity.toFixed(1)} points
          </p>
        </div>
      </div>
    </div>
  );
}