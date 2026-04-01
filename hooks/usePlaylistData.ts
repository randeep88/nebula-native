import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const usePlaylistData = (playlistId: string | number) => {
  return useQuery({
    queryKey: ["playlists-details", playlistId],
    queryFn: async () => {
      const res = await api.get(`/playlists?id=${playlistId}`);
      const playlistDetails = res.data.data;
      return playlistDetails;
    },
  });
};
