"use client";
import { ItemType } from "@/components/entities/ItemType";
import EditItemSheet from "./EditItemSheet";
import NewItemSheet from "./NewItemSheet";
import TransactionSheet from "../transactions/TransactionSheet";

const ItemSheet = ({ itemName }: { itemName: ItemType }) => {
  if (itemName === "transactions") {
    return <TransactionSheet />;
  }
  return (
    <>
      <EditItemSheet itemName={itemName} />
      <NewItemSheet itemName={itemName} />
    </>
  );
};

export default ItemSheet;
