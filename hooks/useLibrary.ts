import { usePlayerStore } from "@/store/usePlayerStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { api } from "../utils/api";
import { backendAPI } from "../utils/backendAPI";

export const useLibrary = () => {
  const [token, setToken] = useState<string | null>(null);
  const { currentSong } = usePlayerStore();
  const toast = useToast();

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  const queryClient = useQueryClient();

  // Songs --------------------------------------------------------------------------
  const {
    data: songDetails,
    isPending: isSongDetailsLoading,
    isError: isSongDetailsError,
    refetch: refetchSongs,
  } = useQuery({
    queryKey: ["librarySongs"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.get("/library/song", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const songIds = res.data || [];
      const results = await Promise.allSettled(
        songIds.map(async (song: any) => {
          const res = await api.get(`/songs/${song.songId}`);
          return {
            type: "song",
            success: true,
            id: song.songId,
            ...res.data,
          };
        }),
      );
      return results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    },
  });

  const { mutate: addSong, isPending: isAddingSong } = useMutation({
    mutationFn: async (songId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.post(
        "/library/song/add",
        { songId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onMutate: async (songId) => {
      await queryClient.cancelQueries({ queryKey: ["librarySongs"] });
      const previous = queryClient.getQueryData(["librarySongs"]);
      queryClient.setQueryData(["librarySongs"], (old: any) => [
        ...(old || []),
        { type: "song", success: true, id: songId, data: [currentSong] },
      ]);

      return { previous };
    },
    onError: (error, songId, context) => {
      queryClient.setQueryData(["librarySongs"], context?.previous);
      toast.show("Failed to add song to library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["librarySongs"] });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["librarySongs"] });
      queryClient.refetchQueries({ queryKey: ["librarySongs"] });
      toast.show("Song added to library", { duration: 1500 });
    },
  });

  const { mutate: removeSong, isPending: isRemovingSong } = useMutation({
    mutationFn: async (songId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.delete("/library/song/remove", {
        data: { songId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onMutate: async (songId) => {
      await queryClient.cancelQueries({ queryKey: ["librarySongs"] });
      const previous = queryClient.getQueryData(["librarySongs"]);

      queryClient.setQueryData(["librarySongs"], (old: any) =>
        (old || []).filter((entry: any) => entry.id !== songId),
      );

      return { previous };
    },
    onError: (error, songId, context) => {
      queryClient.setQueryData(["librarySongs"], context?.previous);
      toast.show("Failed to remove song from library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["librarySongs"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["librarySongs"] });
      queryClient.refetchQueries({ queryKey: ["librarySongs"] });
      toast.show("Song removed from library", {
        duration: 1500,
      });
    },
  });

  // Artists --------------------------------------------------------------------------
  const {
    data: artistDetails,
    isPending: isArtistDetailsLoading,
    isError: isArtistDetailsError,
    refetch: refetchArtists,
  } = useQuery({
    queryKey: ["libraryArtists"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.get("/library/artist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const artistIds = res.data || [];
      const results = await Promise.allSettled(
        artistIds.map(async (artist: any) => {
          const res = await api.get(`/artists/${artist.artistId}`);
          return {
            type: "artist",
            success: true,
            id: artist.artistId,
            ...res.data,
          };
        }),
      );
      return results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    },
  });

  const { mutate: addArtist, isPending: isAddingArtist } = useMutation({
    mutationFn: async (artistId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.post(
        "/library/artist/add",
        { artistId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onMutate: async (artistId) => {
      await queryClient.cancelQueries({ queryKey: ["libraryArtists"] });
      const previous = queryClient.getQueryData(["libraryArtists"]);
      queryClient.setQueryData(["libraryArtists"], (old: any) => [
        ...(old || []),
        { type: "artist", success: true, id: artistId },
      ]);

      return { previous };
    },
    onError: (error, artistId, context) => {
      queryClient.setQueryData(["libraryArtists"], context?.previous);
      toast.show("Failed to add artist to library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryArtists"] });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryArtists"] });
      queryClient.refetchQueries({ queryKey: ["libraryArtists"] });
      toast.show("Artist added to library", { duration: 1500 });
    },
  });

  const { mutate: removeArtist, isPending: isRemovingArtist } = useMutation({
    mutationFn: async (artistId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.delete("/library/artist/remove", {
        data: { artistId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onMutate: async (artistId) => {
      await queryClient.cancelQueries({ queryKey: ["libraryArtists"] });
      const previous = queryClient.getQueryData(["libraryArtists"]);

      queryClient.setQueryData(["libraryArtists"], (old: any) =>
        (old || []).filter((entry: any) => entry.id !== artistId),
      );

      return { previous };
    },
    onError: (error, artistId, context) => {
      queryClient.setQueryData(["libraryArtists"], context?.previous);
      toast.show("Failed to remove artist from library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryArtists"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryArtists"] });
      queryClient.refetchQueries({ queryKey: ["libraryArtists"] });
      toast.show("Artist removed from library", {
        duration: 1500,
      });
    },
  });

  // Playlist -----------------------------------------------------

  const {
    data: playlistDetails,
    isPending: isPlaylistDetailLoading,
    isError: isPlaylistDetailError,
    refetch: refetchPlaylists,
  } = useQuery({
    queryKey: ["libraryPlaylists"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.get("/library/playlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const playlistIds = (res.data || []).map((p: any) => ({
        type: "playlist",
        ...p,
      }));
      const results = await Promise.allSettled(
        playlistIds.map(async (playlist: any) => {
          const res = await api.get(`/playlists?id=${playlist.playlistId}`);
          return {
            type: "playlist",
            success: true,
            id: playlist.playlistId,
            ...res.data,
          };
        }),
      );
      return results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    },
  });

  const { mutate: addPlaylist, isPending: isAddingPlaylist } = useMutation({
    mutationFn: async (playlistId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.post(
        "/library/playlist/add",
        { playlistId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onMutate: async (playlistId) => {
      await queryClient.cancelQueries({ queryKey: ["libraryPlaylists"] });
      const previous = queryClient.getQueryData(["libraryPlaylists"]);
      queryClient.setQueryData(["libraryPlaylists"], (old: any) => [
        ...(old || []),
        { type: "playlist", success: true, id: playlistId },
      ]);

      return { previous };
    },
    onError: (error, playlistId, context) => {
      queryClient.setQueryData(["libraryPlaylists"], context?.previous);
      toast.show("Failed to add playlist to library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryPlaylists"] });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryPlaylists"] });
      queryClient.refetchQueries({ queryKey: ["libraryPlaylists"] });
      toast.show("Playlist added to library", { duration: 1500 });
    },
  });

  const { mutate: removePlaylist, isPending: isRemovingPlaylist } = useMutation(
    {
      mutationFn: async (playlistId: string) => {
        if (!token) throw new Error("No token found");
        const res = await backendAPI.delete("/library/playlist/remove", {
          data: { playlistId },
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      },
      onMutate: async (playlistId) => {
        await queryClient.cancelQueries({ queryKey: ["libraryPlaylists"] });
        const previous = queryClient.getQueryData(["libraryPlaylists"]);

        queryClient.setQueryData(["libraryPlaylists"], (old: any) =>
          (old || []).filter((entry: any) => entry.id !== playlistId),
        );

        return { previous };
      },
      onError: (_error, _playlistId, context) => {
        queryClient.setQueryData(["libraryPlaylists"], context?.previous);
        toast.show("Failed to remove playlist from library");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["libraryPlaylists"] });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["libraryPlaylists"] });
        queryClient.refetchQueries({ queryKey: ["libraryPlaylists"] });
        toast.show("Playlist removed from library", {
          duration: 1500,
        });
      },
    },
  );

  // Albums ---------------------------------------------------------

  const {
    data: albumDetails,
    isPending: isAlbumDetailLoading,
    isError: isAlbumDetailError,
    refetch: refetchAlbums,
  } = useQuery({
    queryKey: ["libraryAlbums"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.get("/library/album", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const albumIds = (res.data || []).map((a: any) => ({
        type: "album",
        ...a,
      }));
      const results = await Promise.allSettled(
        albumIds.map(async (album: any) => {
          const res = await api.get(`/albums?id=${album.albumId}`);
          return {
            type: "album",
            success: true,
            id: album.albumId,
            ...res.data,
          };
        }),
      );
      return results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    },
  });

  const { mutate: addAlbum, isPending: isAddingAlbum } = useMutation({
    mutationFn: async (albumId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.post(
        "/library/album/add",
        { albumId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onMutate: async (albumId) => {
      await queryClient.cancelQueries({ queryKey: ["libraryAlbums"] });
      const previous = queryClient.getQueryData(["libraryAlbums"]);
      queryClient.setQueryData(["libraryAlbums"], (old: any) => [
        ...(old || []),
        { type: "album", success: true, id: albumId },
      ]);

      return { previous };
    },
    onError: (error, albumId, context) => {
      queryClient.setQueryData(["libraryAlbums"], context?.previous);
      toast.show("Failed to add album to library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryAlbums"] });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryAlbums"] });
      queryClient.refetchQueries({ queryKey: ["libraryAlbums"] });
      toast.show("Album added to library", { duration: 1500 });
    },
  });

  const { mutate: removeAlbum, isPending: isRemovingAlbum } = useMutation({
    mutationFn: async (albumId: string) => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.delete("/library/album/remove", {
        data: { albumId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onMutate: async (albumId) => {
      await queryClient.cancelQueries({ queryKey: ["libraryAlbums"] });
      const previous = queryClient.getQueryData(["libraryAlbums"]);

      queryClient.setQueryData(["libraryAlbums"], (old: any) =>
        (old || []).filter((entry: any) => entry.id !== albumId),
      );

      return { previous };
    },
    onError: (_error, _albumId, context) => {
      queryClient.setQueryData(["libraryAlbums"], context?.previous);
      toast.show("Failed to remove album from library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryAlbums"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryAlbums"] });
      queryClient.refetchQueries({ queryKey: ["libraryAlbums"] });
      toast.show("Album removed from library", {
        duration: 1500,
      });
    },
  });

  // ========== Combine All ==========
  const libraryItems = useMemo(() => {
    return [
      ...(songDetails || []),
      ...(artistDetails || []),
      ...(albumDetails || []),
      ...(playlistDetails || []),
    ];
  }, [songDetails, artistDetails, playlistDetails, albumDetails]);

  // ========== Unified Loading/Error ==========
  const isLoading =
    isArtistDetailsLoading ||
    isPlaylistDetailLoading ||
    isAlbumDetailLoading ||
    isSongDetailsLoading;

  const isError =
    isArtistDetailsError ||
    isPlaylistDetailError ||
    isAlbumDetailError ||
    isSongDetailsError;

  // ========== Unified Refetch ==========
  const refetch = async () => {
    await Promise.all([
      refetchArtists(),
      refetchPlaylists(),
      refetchAlbums(),
      refetchSongs,
    ]);
  };

  return {
    libraryItems,
    isLoading,
    isError,
    refetch,
    isArtistDetailsLoading,
    isPlaylistDetailLoading,
    isAlbumDetailLoading,
    isSongDetailsLoading,
    addSong,
    removeSong,
    isAddingSong,
    isRemovingSong,
    addArtist,
    removeArtist,
    isAddingArtist,
    isRemovingArtist,
    addPlaylist,
    removePlaylist,
    isAddingPlaylist,
    isRemovingPlaylist,
    addAlbum,
    removeAlbum,
    isAddingAlbum,
    isRemovingAlbum,
  };
};
