"use server";

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_URL;

const headers = {
  Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

interface SearchOptions {
  query: string;
  year?: string;
}

interface MediaItem {
  popularity: number;
  vote_average: number;
  media_type: string;
}

interface TMDBVideo {
  id: string;
  key: string;
  type: string;
  site: string;
  name: string;
}

interface FavoriteMovie {
  id: number;
  title: string;
}

interface AddToFavoritesResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

interface AccountDetails {
  id: number;
  name: string;
  username: string;
  include_adult: boolean;
  iso_3166_1: string;
  iso_639_1: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string;
  first_air_date: string;
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: Movie[];
}

export interface WatchlistItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: "movie" | "tv";
  overview: string;
  first_air_date?: string;
  release_date?: string;
}

async function fetchFromTMDB(endpoint: string) {
  if (!TMDB_ACCESS_TOKEN) {
    throw new Error("TMDB access token is not configured");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.status_message || "Failed to fetch data");
  }

  return response.json();
}

async function searchMovies({ query, year }: SearchOptions) {
  const yearParam = year ? `&year=${year}` : "";
  const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}${yearParam}&include_adult=false`);
  return data.results.map((item: MediaItem) => ({ ...item, media_type: "movie" }));
}

async function searchTVShows({ query, year }: SearchOptions) {
  const yearParam = year ? `&first_air_date_year=${year}` : "";
  const data = await fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}${yearParam}&include_adult=false`);
  return data.results.map((item: MediaItem) => ({ ...item, media_type: "tv" }));
}

export async function searchMedia(searchTerm: string) {
  let query = searchTerm;
  let year = "";

  const yearMatch = searchTerm.match(/y:(\d{4})/);
  if (yearMatch) {
    year = yearMatch[1];
    query = searchTerm.replace(/\s*y:\d{4}/, "").trim();
  }

  try {
    const [movies, tvShows] = await Promise.all([searchMovies({ query, year }), searchTVShows({ query, year })]);

    return [...movies, ...tvShows].sort((a, b) => {
      const popularityWeight = 0.7;
      const voteWeight = 0.3;

      const scoreA = a.popularity * popularityWeight + a.vote_average * voteWeight;
      const scoreB = b.popularity * popularityWeight + b.vote_average * voteWeight;

      return scoreB - scoreA;
    });
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

const fetchMovies = async (endpoint: string, page: number = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching movies from ${endpoint}:`, error);
    throw error;
  }
};

export async function fetchTvTrailerEpisode(id: string | number, season_num: string | number, episode_num: string | number) {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/season/${season_num}/episode/${episode_num}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const trailers = data.results.filter((video: TMDBVideo) => video.type === "Trailer");
    const teasers = data.results.filter((video: TMDBVideo) => video.type === "Teaser");
    const clips = data.results.filter((video: TMDBVideo) => video.type === "Clip");
    const btss = data.results.filter((video: TMDBVideo) => video.type === "Behind the Scenes");
    const featurettes = data.results.filter((video: TMDBVideo) => video.type === "Featurette");

    if (clips.length > 0) {
      data.clips = clips;
    }

    if (teasers.length > 0) {
      data.teasers = teasers;
    }

    if (trailers.length > 0) {
      data.trailers = trailers;
    }

    if (data.results.length > 0) {
      return data;
    }

    if (btss.length > 0) {
      data.btss = btss;
    }

    if (featurettes.length > 0) {
      data.featurettes = featurettes;
    }
  } catch (error) {
    console.error(`Error fetching movie videos with id ${id}:`, error);
    throw error;
  }
}

export async function fetchNowPlaying(page: number = 1) {
  return fetchMovies("movie/now_playing", page);
}

export async function fetchTopRated(page: number = 1) {
  return fetchMovies("movie/top_rated", page);
}

export async function fetchPopular(page: number = 1) {
  return fetchMovies("movie/popular", page);
}

export async function fetchTvPopular(page: number = 1) {
  return fetchMovies("tv/popular", page);
}

export async function fetchTvTopRated(page: number = 1) {
  return fetchMovies("tv/top_rated", page);
}

// Enhanced pagination functions for load more functionality
export type MovieGridType = "movie_popular" | "movie_top_rated" | "tv_popular" | "tv_top_rated";

export async function fetchMoviesByType(type: MovieGridType, page: number): Promise<Movies[]> {
  const endpointMap = {
    movie_popular: "movie/popular",
    movie_top_rated: "movie/top_rated", 
    tv_popular: "tv/popular",
    tv_top_rated: "tv/top_rated"
  };
  
  const endpoint = endpointMap[type];
  return fetchMovies(endpoint, page);
}

// Legacy functions maintained for compatibility
export async function fetchPopularMoviesPage(page: number) {
  return fetchMovies("movie/popular", page);
}

export async function fetchTopRatedMoviesPage(page: number) {
  return fetchMovies("movie/top_rated", page);
}

export async function fetchPopularTvPage(page: number) {
  return fetchMovies("tv/popular", page);
}

export async function fetchTopRatedTvPage(page: number) {
  return fetchMovies("tv/top_rated", page);
}

// Parallel homepage data fetching
export async function fetchHomepageData() {
  try {
    const [popularMovies, topRatedMovies, popularTv, topRatedTv] = await Promise.all([
      fetchPopular(1),
      fetchTopRated(1), 
      fetchTvPopular(1),
      fetchTvTopRated(1)
    ]);

    return {
      popularMovies,
      topRatedMovies,
      popularTv,
      topRatedTv
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    throw error;
  }
}

export async function fetchFilm(id: string | number, media_type: string) {
  try {
    const response = await fetch(`${BASE_URL}/${media_type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const response_videos = await fetch(`${BASE_URL}/${media_type}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_videos = await response_videos.json();

    const trailers = data_videos.results.filter((video: TMDBVideo) => video.type === "Trailer");
    const teasers = data_videos.results.filter((video: TMDBVideo) => video.type === "Teaser");
    const clips = data_videos.results.filter((video: TMDBVideo) => video.type === "Clip");
    const btss = data_videos.results.filter((video: TMDBVideo) => video.type === "Behind the Scenes");
    const featurettes = data_videos.results.filter((video: TMDBVideo) => video.type === "Featurette");

    const response_recommends = await fetch(`${BASE_URL}/${media_type}/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_recommends = await response_recommends.json();
    data.recommendations = data_recommends;

    const response_images = await fetch(`${BASE_URL}/${media_type}/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_images = await response_images.json();
    data.images = data_images;

    const response_credits = await fetch(`${BASE_URL}/${media_type}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_credits = await response_credits.json();
    data.credits = data_credits;

    if (media_type === "tv") {
      const response_creditsTv = await fetch(`${BASE_URL}/tv/${id}/aggregate_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
      const data_creditsTv = await response_creditsTv.json();
      data.creditsTv = data_creditsTv;

      data.creditsTv.cast.forEach((castMember: { roles: { character: string }[]; character?: string }) => {
        if (castMember.roles && castMember.roles.length > 0) {
          castMember.character = castMember.roles[0].character;
        }
      });
    }

    if (trailers.length > 0) {
      data.trailers = trailers;
    }

    if (teasers.length > 0) {
      data.teasers = teasers;
    }

    if (clips.length > 0) {
      data.clips = clips;
    }

    if (btss.length > 0) {
      data.btss = btss;
    }

    if (featurettes.length > 0) {
      data.featurettes = featurettes;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    throw error;
  }
}

export async function fetchTvEpisode(id: string | number, seasonNumber: string | number, episodeNumber: string | number) {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const response_images = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if (!response_images.ok) {
      throw new Error("Network response was not ok");
    }
    const images = await response_images.json();
    data.images = images;

    const response_recommends = await fetch(`${BASE_URL}/tv/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_recommends = await response_recommends.json();
    data.recommendations = data_recommends;

    const response_TvName = await fetch(`${BASE_URL}/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_tvName = await response_TvName.json();
    data.tvName = data_tvName.name;

    const response_seasonName = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if (!response_seasonName.ok) {
      throw new Error("Network response was not ok");
    }
    const season_name = await response_seasonName.json();
    data.seasonName = season_name.name;

    return data;
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    throw error;
  }
}

export async function fetchTvSeason(id: string | number, seasonNumber: string | number) {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const response_TvName = await fetch(`${BASE_URL}/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    const data_tvName = await response_TvName.json();
    data.tvName = data_tvName.name;

    return data;
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    throw error;
  }
}

export async function checkIfFavorite(movieId: number, sessionId: string, media_type: string) {
  try {
    const response = await fetch(`${BASE_URL}/account/{account_id}/favorite/${media_type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }

    const data = await response.json();
    const favoriteMovies: FavoriteMovie[] = data.results;

    return favoriteMovies.some((movie) => movie.id === movieId);
  } catch (error) {
    console.error("Error checking if favorite:", error);
    throw error;
  }
}

export async function addToFavorites(movieId: number, sessionId: string, isFavorite: boolean, media_type: string) {
  try {
    const response = await fetch(`${BASE_URL}/account/{account_id}/favorite?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: media_type,
        media_id: movieId,
        favorite: !isFavorite,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update favorite status");
    }

    const data: AddToFavoritesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating favorite status:", error);
    throw error;
  }
}

export async function fetchAccountDetails(sessionId: string) {
  try {
    const response = await fetch(`${BASE_URL}/account?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch account details");
    }

    const data: AccountDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
}

export async function fetchFavoritesMovies(sessionId: string) {
  try {
    const response = await fetch(`${BASE_URL}/account/{account_id}/favorite/movies?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}&language=en-US&sort_by=created_at.desc`);

    if (!response.ok) {
      throw new Error("Failed to fetch favorite movies");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

export async function fetchFavoritesTv(sessionId: string) {
  try {
    const response = await fetch(`${BASE_URL}/account/{account_id}/favorite/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}&language=en-US&sort_by=created_at.desc`);

    if (!response.ok) {
      throw new Error("Failed to fetch favorite TV shows");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

export async function removeFromFavorites(movieId: number, sessionId: string, media_type: string) {
  try {
    const response = await fetch(`${BASE_URL}/account/{account_id}/favorite?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: media_type,
        media_id: movieId,
        favorite: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove from favorites");
    }

    const data: AddToFavoritesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

export async function getCollection(collectionId: number): Promise<Collection> {
  const response = await fetch(`${BASE_URL}/collection/${collectionId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);

  if (!response.ok) {
    throw new Error("Failed to fetch collection");
  }

  return response.json();
}

export async function getWatchlist(sessionId: string, accountId: string): Promise<WatchlistItem[]> {
  const [movieWatchlist, tvWatchlist] = await Promise.all([
    fetch(`${BASE_URL}/account/${accountId}/watchlist/movies?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}&language=en-US&sort_by=created_at.desc`).then((res) => res.json()),
    fetch(`${BASE_URL}/account/${accountId}/watchlist/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}&language=en-US&sort_by=created_at.desc`).then((res) => res.json()),
  ]);

  return [...movieWatchlist.results.map((item: WatchlistItem) => ({ ...item, media_type: "movie" })), ...tvWatchlist.results.map((item: WatchlistItem) => ({ ...item, media_type: "tv" }))];
}

export async function addToWatchlist(sessionId: string, accountId: string, mediaId: number, mediaType: "movie" | "tv", watchlist: boolean): Promise<void> {
  const response = await fetch(`${BASE_URL}/account/${accountId}/watchlist?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_type: mediaType,
      media_id: mediaId,
      watchlist,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update watchlist");
  }
}
