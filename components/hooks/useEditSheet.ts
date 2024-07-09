import { create } from "zustand";

type ID = string;

type EditSheetState = {
  id: ID;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

const useEditSheet = create<EditSheetState>((set) => ({
  id: "",
  isOpen: false,
  onOpen: (id: ID) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: "" }),
}));

export default useEditSheet;
