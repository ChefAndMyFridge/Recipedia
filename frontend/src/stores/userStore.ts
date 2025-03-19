import { create } from "zustand";
import { persist } from "zustand/middleware";
import defaultProfile from "@assets/images/ProfileDad.png";

interface UserState {
  userId: number;
  username: string;
  currentProfileImg: string;
  setUserName: (username: string) => void;
  setCurrentProfileImg: (profileImg: string) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: 1,
      username: "아빠",
      currentProfileImg: defaultProfile,
      setUserName: (username) => set({ username }),
      setCurrentProfileImg: (profileImg) => set({ currentProfileImg: profileImg }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
