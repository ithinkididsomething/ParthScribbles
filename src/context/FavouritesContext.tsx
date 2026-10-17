import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, Review } from '../types';
import { INITIAL_GAMES, INITIAL_REVIEWS } from '../data/games';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

interface FavouritesContextType {
  // Favourites & reviews
  favourites: string[]; // game IDs
  toggleFavourite: (gameId: string) => void;
  reviews: Review[];
  addReview: (gameId: string, rating: number, comment: string, userName?: string) => Promise<boolean>;
  
  // Games & developer submissions
  games: Game[]; // approved games list for public catalogue
  allSubmissions: Game[]; // all games for admin moderation
  pendingSubmissions: Game[]; // games awaiting admin review
  submitGame: (gameData: Omit<Game, 'id' | 'createdAt' | 'status' | 'playCount'>) => Promise<{ success: boolean; id: string; error?: string }>;
  approveGame: (gameId: string) => Promise<boolean>;
  rejectGame: (gameId: string) => Promise<boolean>;
  toggleVerification: (gameId: string, currentType?: 'verified' | 'community') => Promise<boolean>;

  // Admin authentication
  isAdmin: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Sync state
  isSyncing: boolean;
  lastSyncedAt: Date | null;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crayon_offline_favourites');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['gdg-runner', 'punk-rock-doodle-jumper'];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('crayon_offline_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [allSubmissions, setAllSubmissions] = useState<Game[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('parth_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email === 'psa11@gmail.com';
      }
    } catch {}
    return false;
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('parth_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email || null;
      }
    } catch {}
    return null;
  });

  // Sync favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('crayon_offline_favourites', JSON.stringify(favourites));
    } catch (err) {
      console.warn('Failed to cache favourites to localStorage', err);
    }
  }, [favourites]);

  // Sync reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('crayon_offline_reviews', JSON.stringify(reviews));
    } catch (err) {
      console.warn('Failed to cache reviews to localStorage', err);
    }
  }, [reviews]);

  // Real-time listener for Firestore reviews
  useEffect(() => {
    const path = 'reviews';
    setIsSyncing(true);

    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const firestoreReviews: Review[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Review;
          if (data && data.id && data.gameId) {
            firestoreReviews.push(data);
          }
        });

        const combined = [...firestoreReviews, ...INITIAL_REVIEWS];
        const unique = Array.from(new Map(combined.map((r) => [r.id, r])).values());
        unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setReviews(unique);
        setIsSyncing(false);
        setLastSyncedAt(new Date());
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        setIsSyncing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time listener for Firestore games & community submissions
  useEffect(() => {
    const path = 'games';
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const firestoreGames: Game[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Game;
          if (data && data.id && data.title) {
            firestoreGames.push(data);
          }
        });

        setAllSubmissions(firestoreGames);

        // Filter games approved for public catalogue
        const approvedFromFirestore = firestoreGames.filter((g) => g.status === 'approved');
        
        // Merge with INITIAL_GAMES (initial games are always approved)
        const combined = [...INITIAL_GAMES, ...approvedFromFirestore];
        const uniqueGames = Array.from(new Map(combined.map((g) => [g.id, g])).values());
        setGames(uniqueGames);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleFavourite = (gameId: string) => {
    setFavourites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const addReview = async (
    gameId: string,
    rating: number,
    comment: string,
    userName = 'SketchPlayer'
  ): Promise<boolean> => {
    const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      gameId,
      userName: userName.slice(0, 60),
      userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
      rating: safeRating,
      comment: comment.slice(0, 950),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);

    const path = `reviews/${newReview.id}`;
    try {
      await setDoc(doc(db, 'reviews', newReview.id), newReview);
      setLastSyncedAt(new Date());
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      return false;
    }
  };

  // Game Submission by Verified or Community Developers (awaits admin access)
  const submitGame = async (
    gameData: Omit<Game, 'id' | 'createdAt' | 'status' | 'playCount'>
  ): Promise<{ success: boolean; id: string; error?: string }> => {
    const id = `game-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newGame: Game = {
      ...gameData,
      id,
      slug: gameData.slug || id,
      status: 'pending', // Awaits admin approval
      createdAt: new Date().toISOString(),
      playCount: 0,
    };

    const path = `games/${id}`;
    try {
      await setDoc(doc(db, 'games', id), newGame);
      return { success: true, id };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      return {
        success: false,
        id,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  // Admin game approval
  const approveGame = async (gameId: string): Promise<boolean> => {
    const path = `games/${gameId}`;
    try {
      await updateDoc(doc(db, 'games', gameId), {
        status: 'approved',
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return false;
    }
  };

  // Admin game rejection
  const rejectGame = async (gameId: string): Promise<boolean> => {
    const path = `games/${gameId}`;
    try {
      await updateDoc(doc(db, 'games', gameId), {
        status: 'rejected',
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return false;
    }
  };

  // Admin toggle developer verification
  const toggleVerification = async (
    gameId: string,
    currentType?: 'verified' | 'community'
  ): Promise<boolean> => {
    const path = `games/${gameId}`;
    const newType = currentType === 'verified' ? 'community' : 'verified';
    try {
      await updateDoc(doc(db, 'games', gameId), {
        developerType: newType,
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return false;
    }
  };

  // Admin Login verification
  const loginAdmin = (email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === 'psa11@gmail.com' && pass === 'psa11') {
      setIsAdmin(true);
      setAdminEmail('psa11@gmail.com');
      try {
        localStorage.setItem(
          'parth_admin_session',
          JSON.stringify({ email: 'psa11@gmail.com', loggedInAt: Date.now() })
        );
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminEmail(null);
    try {
      localStorage.removeItem('parth_admin_session');
    } catch {}
  };

  const pendingSubmissions = allSubmissions.filter((g) => g.status === 'pending');

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        toggleFavourite,
        reviews,
        addReview,
        games,
        allSubmissions,
        pendingSubmissions,
        submitGame,
        approveGame,
        rejectGame,
        toggleVerification,
        isAdmin,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        isSyncing,
        lastSyncedAt,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error('useFavourites must be used within a FavouritesProvider');
  return context;
};
