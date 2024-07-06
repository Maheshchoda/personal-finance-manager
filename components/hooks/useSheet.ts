import { create } from "zustand";

type SheetState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useSheet = create<SheetState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSheet;
