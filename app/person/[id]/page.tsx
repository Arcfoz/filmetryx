"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonProfile } from "@/components/PersonProfile";
import { CreditsList } from "@/components/CreditsList";

interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
  homepage: string | null;
}

interface Credit {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  vote_average: number;
  popularity: number;
  job?: string;
  character?: string;
  department?: string;
  media_type: string;
}

interface Image {
  file_path: string;
  width: number;
  height: number;
}

export default function PersonPage({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch person details
        const personResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/person/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const personData = await personResponse.json();
        setPerson(personData);

        // Fetch combined credits
        const creditsResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/person/${params.id}/combined_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const creditsData = await creditsResponse.json();

        // Combine and process both cast and crew credits
        const allCredits = [
          ...(creditsData.cast || []).map((credit: Credit) => ({
            ...credit,
            department: "Acting",
            job: credit.character,
          })),
          ...(creditsData.crew || []),
        ];

        setCredits(allCredits);

        // Fetch images
        const imagesResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/person/${params.id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const imagesData = await imagesResponse.json();
        setImages(imagesData.profiles);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading || !person) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <PersonProfile person={person} />

          {/* Right Column - Content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-6">{person.name}</h1>

            {person.biography && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Biography</h2>
                <p className="text-muted-foreground whitespace-pre-line">{person.biography}</p>
              </div>
            )}

            <Tabs defaultValue="credits" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="credits">Credits</TabsTrigger>
                {images.length > 0 && <TabsTrigger value="photos">Photos</TabsTrigger>}
              </TabsList>

              <TabsContent value="credits">
                <CreditsList credits={credits} />
              </TabsContent>

              <TabsContent value="photos">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(image.file_path)}>
                      <div className="relative aspect-[2/3]">
                        <Image src={`https://image.tmdb.org/t/p/w342${image.file_path}`} alt={`${person.name} photo ${index + 1}`} fill className="object-cover rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full h-full">
            <Image src={`https://image.tmdb.org/t/p/original${selectedImage}`} alt="Preview" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
