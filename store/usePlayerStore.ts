import { AudioPlayer } from "expo-audio";
import { create } from "zustand";

interface PlayerStore {
  searchQuery: string | null;
  setSearchQuery: (query: string) => void;
  [key: string]: any;
  player: AudioPlayer | null;
  setPlayer: (player: AudioPlayer) => void;
  dominantColor: string | null;
  setDominantColor: (color: string) => void;
}

const shuffle = (array: any) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  player: null,
  setPlayer: (player) => set({ player }),
  dominantColor: null,
  setDominantColor: (color: string) => set({ dominantColor: color }),

  bgColor: "white",
  setBgColor: (opt: any) => set({ bgColor: opt }),
  isOpen: false,
  setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
  isBgOn: false,
  setIsBgOn: () => set((state: any) => ({ isBgOn: !state.isBgOn })),
  currentSong: null,
  currentIndex: 0,
  isPlaying: false,
  nextSongEnabled: false,
  prevSongEnabled: false,
  searchQuery: null,
  isLoading: false,
  canPlay: false,
  setCanPlay: (opt: any) => set({ canPlay: opt }),
  isQueueOpen: false,
  active: "",
  originalQueue: [],
  songsQueue: [],
  isRepeat: "false",
  isShuffle: false,

  libraryDetails: [],
  setLibraryDetails: (data: any) => set({ libraryDetails: data }),
  library: [],
  setLibrary: (data: any) => set({ library: data }),
  volume: 90,
  setVolume: (value: any) => set({ volume: value }),
  setActive: (state: any) => set({ active: state }),

  setSongsQueue: (songs: any) =>
    set({
      originalQueue: [...songs],
      songsQueue: [...songs],
      currentIndex: 0,
    }),

  addSongToQueue: (song: any) => {
    const state: any = get();
    set({
      songsQueue: [...state.songsQueue, song],
    });
  },

  songs: [],
  albums: [],
  albumDetails: [],
  setAlbumDetails: (data: any) => set({ albumDetails: data }),
  setAlbum: (data: any) => set({ album: data }),
  artists: [],
  playlists: [],
  single: [],
  setSingle: (data: any) => set({ single: data }),

  setRepeat: (option: any) => set({ isRepeat: option }),

  toggleShuffle: () => {
    const state: any = get();
    const isShuffle = !state.isShuffle;
    let newSongsQueue;

    if (isShuffle) {
      if (state.currentSong) {
        const otherSongs = state.originalQueue.filter(
          (song: any) => song.id !== state.currentSong.id,
        );
        newSongsQueue = [state.currentSong, ...shuffle(otherSongs)];
      } else {
        newSongsQueue = shuffle(state.originalQueue);
      }

      const newCurrentIndex = state.currentSong
        ? newSongsQueue.findIndex(
            (song: any) => song.id === state.currentSong.id,
          )
        : 0;

      set({
        isShuffle,
        songsQueue: newSongsQueue,
        currentIndex: newCurrentIndex,
      });
    } else {
      const currentSongIndexInOriginal = state.originalQueue.findIndex(
        (song: any) => song.id === state.currentSong?.id,
      );
      const newIndex =
        currentSongIndexInOriginal >= 0 ? currentSongIndexInOriginal : 0;

      set({
        isShuffle,
        songsQueue: [...state.originalQueue],
        currentIndex: newIndex,
      });
    }
  },

  playlistDetails: [],
  artistDetails: [],
  artistSongs: [],
  artistAlbums: [],
  setArtistDetails: (data: any) => set({ artistDetails: data }),
  setPlaylistDetails: (data: any) => set({ playlistDetails: data }),
  setArtistSongs: (data: any) => set({ artistSongs: data }),
  setArtistAlbums: (data: any) => set({ artistAlbums: data }),
  setSongs: (data: any) => set({ songs: data }),
  setAlbums: (data: any) => set({ albums: data }),
  setArtists: (data: any) => set({ artists: data }),
  setPlaylists: (data: any) => set({ playlists: data }),
  setIsLoading: (option: any) => set({ isLoading: option }),
  setSearchQuery: (query: any) => set({ searchQuery: query }),

  setCurrentSong: (song: any) => {
    const state: any = get();
    const index = state.songsQueue.findIndex((s: any) => s.id === song.id);

    if (index >= 0) {
      set({
        currentSong: song,
        currentIndex: index,
        nextSongEnabled:
          index < state.songsQueue.length - 1 || state.isRepeat !== "false",
        prevSongEnabled: index > 0,
        isPlaying: true,
      });
    } else {
      const updatedQueue = [song, ...state.songsQueue];
      const updatedOriginal = [song, ...state.originalQueue];
      set({
        currentSong: song,
        currentIndex: 0,
        songsQueue: updatedQueue,
        originalQueue: updatedOriginal,
        nextSongEnabled: updatedQueue.length > 1,
        prevSongEnabled: false,
        isPlaying: true,
      });
    }
  },

  setIsPlaying: (option: any) => set({ isPlaying: option }),
  setIsQueueOpen: (option: any) => set({ isQueueOpen: option }),
  toggleQueueOpen: () =>
    set((state: any) => ({ isQueueOpen: !state.isQueueOpen })),

  nextSong: () => {
    const state: any = get();

    if (!state.songsQueue.length) return;

    const { currentIndex, songsQueue, isRepeat } = state;
    const isLast = currentIndex >= songsQueue.length - 1;

    // Repeat one — same song dobara
    if (isRepeat === "one") {
      state.player?.seekTo(0);
      set({ isPlaying: true });
      return;
    }

    // Repeat all — end par wapas start
    if (isLast && isRepeat === "true") {
      set({
        currentSong: songsQueue[0],
        currentIndex: 0,
        isPlaying: true,
        nextSongEnabled: songsQueue.length > 1,
        prevSongEnabled: true,
      });
      return;
    }

    // Normal next
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      set({
        currentSong: songsQueue[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
        nextSongEnabled:
          nextIndex < songsQueue.length - 1 || isRepeat !== "false",
        prevSongEnabled: true,
      });
    } else {
      set({
        isPlaying: false,
        nextSongEnabled: false,
      });
    }
  },

  prevSong: () => {
    const state: any = get();
    const { currentIndex, songsQueue, isRepeat } = state;

    // Repeat one — same song dobara
    if (isRepeat === "one") {
      state.player?.seekTo(0);
      set({ isPlaying: true });
      return;
    }

    // Pehla song aur repeat all — last song par jao
    if (currentIndex === 0 && isRepeat === "true") {
      const lastIndex = songsQueue.length - 1;
      set({
        currentSong: songsQueue[lastIndex],
        currentIndex: lastIndex,
        isPlaying: true,
        nextSongEnabled: true,
        prevSongEnabled: lastIndex > 0,
      });
      return;
    }

    // Normal prev
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      set({
        currentSong: songsQueue[prevIndex],
        currentIndex: prevIndex,
        isPlaying: true,
        nextSongEnabled: true,
        prevSongEnabled: prevIndex > 0 || isRepeat !== "false",
      });
    }
  },
}));
