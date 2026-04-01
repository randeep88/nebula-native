import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useSuggestedSongs = (songId: string) => {
  const { data: suggestedSongs, isPending } = useQuery({
    queryKey: ["suggested-songs"],
    queryFn: async () => {
      const res = await api.get(`/songs/${songId}/suggestions?limit=100`);
      return res.data.data;
    },
  });

  return { suggestedSongs, isPending };
};

export default useSuggestedSongs;
