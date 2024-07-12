"use client";
import { ItemType } from "@/components/entities/ItemType";
import EditItemSheet from "./EditItemSheet";
import NewItemSheet from "./NewItemSheet";

const ItemSheet = ({ itemName }: { itemName: ItemType }) => {
  return (
    <>
      <EditItemSheet itemName={itemName} />
      <NewItemSheet itemName={itemName} />
    </>
  );
};

export default ItemSheet;
