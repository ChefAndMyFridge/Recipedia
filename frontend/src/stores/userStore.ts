import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      currentProfileImg: "/src/assets/images/ProfileDad.png",
      setUserName: (username) => set({ username }),
      setCurrentProfileImg: (profileImg) => set({ currentProfileImg: profileImg }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
