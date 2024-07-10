"use client";
import ResourceType from "@/components/entities/Resource";
import EditItemSheet from "./EditItemSheet";
import NewItemSheet from "./NewItemSheet";

const ItemSheet = ({ itemName }: ResourceType) => {
  return (
    <>
      <EditItemSheet itemName={itemName} />
      <NewItemSheet itemName={itemName} />
    </>
  );
};

export default ItemSheet;
