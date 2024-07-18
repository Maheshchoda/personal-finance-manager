"use client";
import { ItemType } from "@/components/entities/ItemType";
import EditItemSheet from "./EditItemSheet";
import NewItemSheet from "./NewItemSheet";

const ItemSheet = ({ id, itemType }: { id?: string; itemType: ItemType }) => {
  return (
    <>
      {id ? (
        <EditItemSheet id={id} itemType={itemType} />
      ) : (
        <NewItemSheet itemType={itemType} />
      )}
    </>
  );
};

export default ItemSheet;
