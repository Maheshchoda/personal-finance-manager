import { create } from "zustand";

type ID = string;

type EditSheetState = {
  sheets: Record<ID, boolean>;
  openNewSheet: () => void;
  closeNewSheet: () => void;
  newSheetOpen: boolean;
  onOpen: (id: ID) => void;
  onClose: (id: ID) => void;
  isOpen: (id: ID) => boolean;
};

const useEditSheet = create<EditSheetState>((set, get) => ({
  sheets: {},
  newSheetOpen: false,
  openNewSheet: () => set({ newSheetOpen: true }),
  closeNewSheet: () => set({ newSheetOpen: false }),
  onOpen: (id: ID) =>
    set((state) => ({ sheets: { ...state.sheets, [id]: true } })),
  onClose: (id: ID) =>
    set((state) => ({ sheets: { ...state.sheets, [id]: false } })),
  isOpen: (id: ID) => get().sheets[id] ?? false,
}));

export default useEditSheet;
