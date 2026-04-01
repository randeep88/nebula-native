import { OptionsSheet } from "@/components/Dropdown";
import { createContext, useContext, useRef, useState } from "react";

const OptionsSheetContext = createContext<any>(null);

export const OptionsSheetProvider = ({ children }: { children: any }) => {
  const sheetRef = useRef<any>(null);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);

  const openSheet = (song: any, opts: any[]) => {
    setSelectedSong(song);
    setOptions(opts);
    sheetRef.current?.snapToIndex(0);
  };

  const closeSheet = () => {
    sheetRef.current?.close();
  };

  return (
    <OptionsSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <OptionsSheet ref={sheetRef} song={selectedSong} options={options} />
    </OptionsSheetContext.Provider>
  );
};

export const useOptionsSheet = () => useContext(OptionsSheetContext);
