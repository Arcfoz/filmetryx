"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  total_episode_count: number;
}

export default function MovieCastPage({ params }: { params: { slug: string } }) {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState<{ original_title: string; release_date: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch show info for the title
        const showResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/movie/${params.slug}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const showData = await showResponse.json();
        setShowInfo(showData);

        // Fetch cast data
        const castResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/movie/${params.slug}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const castData = await castResponse.json();
        setCast(castData.cast);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  const filteredCast = cast.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return member.name?.toLowerCase().includes(searchLower) || member.character?.toLowerCase().includes(searchLower);
  });

  if (isLoading || !showInfo) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const releaseDate = new Date(showInfo.release_date);
  const releaseYear = releaseDate.getFullYear();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/movie/${params.slug}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Show
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {showInfo?.original_title} ({releaseYear})
          </h1>

          {/* Search Box */}
          <div className="relative max-w-md mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="Search cast by name or character..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full" />
          </div>

          <p className="text-gray-600 mt-4">{filteredCast.length} Cast Members</p>
        </div>

        {/* Cast Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCast.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-0">
                <Link href={`/person/${member.id}`}>
                  <div className="relative aspect-[2/3]">
                    {member.profile_path ? (
                      <Image src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{member.name}</h3>
                    {member.character && <p className="text-sm text-gray-600">{member.character}</p>}
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCast.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No cast members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
