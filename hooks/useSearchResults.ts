import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const useSearchResults = (searchQuery: string) => {
  const {data, isPending} =  useQuery({
    queryKey: ["search-results", searchQuery],
    queryFn: async () => {
      const [songsRes, albumsRes, playlistsRes] = await Promise.all([
        api.get(`/search/songs?query=${searchQuery}&limit=50`),
        api.get(`/search/albums?query=${searchQuery}&limit=50`),
        api.get(`/search/playlists?query=${searchQuery}&limit=50`),
      ]);

      const songs = songsRes.data.data.results;
      let artists = null;

      if (songs.length > 0) {
        const artistId = songs[0]?.artists?.primary?.[0]?.id;
        if (artistId) {
          const artistsRes = await api.get(`/artists?id=${artistId}`);
          artists = artistsRes.data.data;
        }
      }

      return {
        songs,
        albums: albumsRes.data.data.results,
        playlists: playlistsRes.data.data.results,
        artists,
      };
    },
    enabled: !!searchQuery,
  });

  return {data, isPending}
};
