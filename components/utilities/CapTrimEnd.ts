import { ItemType } from "@/components/entities/ItemType";

const CapTrimEnd = (item: ItemType, trimLast: boolean = false) => {
  let result = item.charAt(0).toUpperCase() + item.slice(1);
  if (trimLast) {
    if (item === "categories") {
      result = "Category";
    } else {
      result = result.slice(0, -1);
    }
  }
  return result;
};

export default CapTrimEnd;
