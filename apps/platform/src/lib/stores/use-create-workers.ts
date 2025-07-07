import { create } from "zustand";

export const useCreateWorkers = create<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsClosed: () => void;
}>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsClosed: () => set({ isOpen: false }),
}));
