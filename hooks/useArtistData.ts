import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const useArtistData = (artistId: string | number) => {
  return useQuery({
    queryKey: ["artists-details", artistId],
    queryFn: async () => {
      const res = await api.get(`/artists/${artistId}`);
      const artistDetails = res.data.data;
      return artistDetails;
    },
  });
};
