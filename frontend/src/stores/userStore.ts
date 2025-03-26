import { create } from "zustand";
import { persist } from "zustand/middleware";
import defaultProfile from "@assets/images/DefaultProfile.png";

interface UserState {
  userId: number;
  username: string;
  currentProfileImg: string;
  setUserId: (userId: number) => void;
  setUserName: (username: string) => void;
  setCurrentProfileImg: (profileImg: string) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: 0,
      username: "닉네임",
      currentProfileImg: defaultProfile,
      setUserId: (userId) => set({ userId }),
      setUserName: (username) => set({ username }),
      setCurrentProfileImg: (profileImg) => set({ currentProfileImg: profileImg }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
