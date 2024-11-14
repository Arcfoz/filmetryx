export interface Movies {
  id: number;
  title?: string;
  name?: string;
  media_type?: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
  backdrop_path: string;
  first_air_date: string;
}

export interface VideoTvEpisode {
  name: string;
  key: string;
  published_at: string;
  trailers?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  clips?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  teasers?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  btss?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  featurettes?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
}

export interface DetailMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  overview: string;
  trailers?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  teasers?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  clips?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  btss?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  featurettes?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  recommendations?: {
    results: Movies[];
  };
  tagline: string;
  homepage: string;
  genres: Array<{ id: number; name: string }>;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }>;
  status: string;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  images?: {
    backdrops?: Array<{
      file_path: string;
    }>;
    posters?: Array<{
      file_path: string;
    }>;
  };
  credits?: {
    cast?: Array<{
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
      roles: Array<{
        character: string;
        episode_count: number;
      }>;
      total_episode_count: number;
    }>;
    crew?: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }>;
  };
}

export interface DetailTv {
  id: number;
  name: string;
  poster_path: string;
  created_by: Array<{
    id: string;
    name: string;
  }>;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  runtime: number;
  overview: string;
  trailers?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  teasers?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  clips?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  btss?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  featurettes?: Array<{
    name: string;
    key: string;
    published_at: string;
  }>;
  recommendations?: {
    results: Movies[];
  };
  tagline: string;
  homepage: string;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }>;
  status: string;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  images?: {
    backdrops?: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
    posters?: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
  };
  credits?: {
    cast?: Array<{
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
      roles: Array<{
        character: string;
        episode_count: number;
      }>;
      total_episode_count: number;
    }>;
    crew?: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }>;
  };
  creditsTv?: {
    cast?: Array<{
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
      roles: Array<{
        character: string;
        episode_count: number;
      }>;
      total_episode_count: number;
    }>;
    crew?: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }>;
  };
  seasons?: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  };
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MediaType {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview: string;
}
