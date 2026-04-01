import { usePlayerStore } from "@/store/usePlayerStore";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { createContext, ReactNode, useContext, useEffect } from "react";

const PlayerContext = createContext<any>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { currentSong, isPlaying, setIsPlaying, nextSong } = usePlayerStore();

  const audioSource = currentSong?.downloadUrl?.[4]?.url;
  const player = useAudioPlayer(audioSource ?? "");
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  useEffect(() => {
    if (!audioSource) return;
    player.play();
    setIsPlaying(true);
  }, [audioSource]);

  useEffect(() => {
    if (!audioSource) return;
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (status?.didJustFinish) {
      nextSong();
    }
  }, [status?.didJustFinish]);

  return (
    <PlayerContext.Provider value={{ player, status, audioSource }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
