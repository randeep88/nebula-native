import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const useSongData = (songId: string | number) => {
  return useQuery({
    queryKey: ["song-details", songId],
    queryFn: async () => {
      const res = await api.get(`/songs/${songId}`);
      const songDetails = res.data.data;
      return songDetails;
    },
    enabled: !!songId,
  });
};
