export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  genre: 'Arcade' | 'Runner' | 'Platformer' | 'Sci-Fi' | 'Puzzle';
  coverUrl: string;
  externalUrl: string;
  controls: string[];
  featured?: boolean;
  createdAt: string;
  playCount: number;
  developerName?: string;
  developerType?: 'verified' | 'community';
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Review {
  id: string;
  gameId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}
