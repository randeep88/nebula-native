import { create } from "zustand";

const useUserData = create((set) => ({
  email: "",
  setEmail: (email: string) => set({ email }),

  username: "",
  setUsername: (username: string) => set({ username }),

  profilePic: "",
  setProfilePic: (profilePic: string) => set({ profilePic }),

  registerData: {},
  setRegisterData: ({
    email,
    username,
    profilePic,
  }: {
    email: string;
    username: string;
    profilePic: string;
  }) => set({ registerData: { email, username, profilePic } }),
}));

export default useUserData;
