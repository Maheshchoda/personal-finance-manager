"use client";
import { ItemType } from "@/components/entities/ItemType";
import EditItemSheet from "./EditItemSheet";
import NewItemSheet from "./NewItemSheet";

interface ItemSheetProps {
  id?: string;
  itemType: ItemType;
}

const ItemSheet = ({ id, itemType }: ItemSheetProps) => {
  return id ? (
    <EditItemSheet id={id} itemType={itemType} />
  ) : (
    <NewItemSheet itemType={itemType} />
  );
};

export default ItemSheet;
