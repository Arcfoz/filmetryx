"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkPlus } from 'lucide-react';
import { addToWatchlist } from '@/lib/tmdb';
import { toast } from "sonner";


interface AddToWatchlistProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
}

export function AddToWatchlist({ mediaId, mediaType }: AddToWatchlistProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToWatchlist = async () => {
    try {
      setIsAdding(true);
      const sessionId = localStorage.getItem('tmdb_session_id') || '';
      const accountId = localStorage.getItem('tmdb_account_id') || '';
      
      await addToWatchlist(
        sessionId,
        accountId,
        mediaId,
        mediaType,
        true
      );

      toast.info("Added to watchlist",
      );
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="gap-2"
      onClick={handleAddToWatchlist}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Bookmark className="h-4 w-4 animate-pulse" />
          Adding...
        </>
      ) : (
        <>
          <BookmarkPlus className="h-4 w-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}