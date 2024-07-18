"use client";
import TransactionSheet from "@/app/(dashboard)/(features)/transactions/TransactionSheet";
import { ItemType } from "@/components/entities/ItemType";
import EditItemSheet from "./EditItemSheet";
import NewItemSheet from "./NewItemSheet";

const ItemSheet = ({ id, itemName }: { id?: string; itemName: ItemType }) => {
  return (
    <>
      {id ? (
        <EditItemSheet id={id} itemName={itemName} />
      ) : (
        <NewItemSheet itemName={itemName} />
      )}
    </>
  );
};

export default ItemSheet;
